import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../db';
import { createProductSlug } from '../utils/slug';

const router = Router();

// Validation middleware
const validate = (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET all products with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 100); // Max 100 per page
        const skip = (page - 1) * limit;
        const categoryId = req.query.category as string | undefined;
        const subcategoryId = req.query.subcategory as string | undefined;
        const brandId = req.query.brand as string | undefined;
        const featured = req.query.featured === 'true';
        const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
        const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
        const inStock = req.query.inStock === 'true';
        const tag = req.query.tag as string | undefined; // Filter by tag

        const where: any = {
            isActive: true
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (subcategoryId) {
            where.subcategoryId = subcategoryId;
        }
        if (brandId) {
            where.brandId = brandId;
        }
        if (featured) {
            where.isFeatured = true;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.basePrice = {};
            if (minPrice !== undefined) where.basePrice.gte = minPrice;
            if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
        }
        if (tag) {
            // Filter by tag in JSON array
            where.tags = {
                contains: tag
            };
        }
        if (inStock) {
            // Check if product has variants with stock > 0, or if no variants, check product stock
            // This is a simplified check - in production you might want more complex logic
            where.OR = [
                {
                    variants: {
                        some: {
                            stock: { gt: 0 },
                            isActive: true
                        }
                    }
                }
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    subcategory: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            nameEn: true,
                            logo: true
                        }
                    },
                    variants: {
                        where: { isActive: true },
                        orderBy: { isDefault: 'desc' },
                        take: 1 // Get default variant for price display
                    },
                    _count: {
                        select: { variants: true }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        // Transform products to include calculated price and stock from variants
        const transformedProducts = products.map(product => {
            const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
            const minPriceVariant = product.variants && product.variants.length > 0
                ? product.variants.reduce((min, v) => v.price < min.price ? v : min, product.variants[0])
                : null;

            // Parse images safely
            let images: string[] = [];
            try {
                images = product.images ? JSON.parse(product.images) : [];
            } catch (e) {
                console.error('Error parsing images for product', product.id, e);
                images = [];
            }

            // Parse tags safely
            let tags: string[] = [];
            try {
                tags = product.tags ? JSON.parse(product.tags) : [];
            } catch (e) {
                console.error('Error parsing tags for product', product.id, e);
                tags = [];
            }

            // Parse specifications safely
            let specifications: Record<string, any> = {};
            try {
                specifications = product.specifications ? JSON.parse(product.specifications) : {};
            } catch (e) {
                console.error('Error parsing specifications for product', product.id, e);
                specifications = {};
            }

            const totalStock = product.variants && product.variants.length > 0
                ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                : 0;

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                basePrice: product.basePrice,
                price: defaultVariant?.price || product.basePrice,
                minPrice: minPriceVariant?.price || product.basePrice,
                images: images,
                image: images.length > 0 ? images[0] : null,
                category: product.category,
                categoryId: product.categoryId,
                subcategory: product.subcategory,
                subcategoryId: product.subcategoryId,
                brand: product.brand,
                brandId: product.brandId,
                stock: totalStock,
                isFeatured: product.isFeatured,
                isActive: product.isActive,
                rating: product.rating,
                reviewCount: product.reviewCount || 0,
                tags: tags,
                specifications: specifications,
                variantsCount: product._count?.variants || 0,
                hasVariants: (product._count?.variants || 0) > 0,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        });

        res.json({
            products: transformedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product by ID or slug
router.get('/:identifier', async (req: Request, res: Response) => {
    try {
        const identifier = req.params.identifier;

        // Try to find by slug first, then by ID
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { slug: identifier },
                    { id: identifier }
                ],
                isActive: true
            },
            include: {
                category: true,
                subcategory: true,
                brand: true,
                variants: {
                    where: { isActive: true },
                    orderBy: [
                        { isDefault: 'desc' },
                        { createdAt: 'asc' }
                    ]
                }
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Transform product to include parsed JSON fields safely
        let images: string[] = [];
        let tags: string[] = [];
        let specifications: Record<string, any> = {};

        try {
            images = product.images ? JSON.parse(product.images) : [];
        } catch (e) {
            console.error('Error parsing images for product', product.id, e);
            images = [];
        }

        try {
            tags = product.tags ? JSON.parse(product.tags) : [];
        } catch (e) {
            console.error('Error parsing tags for product', product.id, e);
            tags = [];
        }

        try {
            specifications = product.specifications ? JSON.parse(product.specifications) : {};
        } catch (e) {
            console.error('Error parsing specifications for product', product.id, e);
            specifications = {};
        }

        const transformedProduct = {
            ...product,
            images: images,
            tags: tags,
            specifications: specifications
        };

        res.json(transformedProduct);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST create product
router.post('/', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('basePrice').isInt({ min: 0 }).withMessage('Base price must be a positive integer'),
    body('categoryId').trim().notEmpty().withMessage('Category ID is required'),
    body('images').optional(),
    body('tags').optional(),
    body('specifications').optional(),
    validate
], async (req: Request, res: Response) => {
    try {
        // Validate category exists
        const category = await prisma.category.findUnique({
            where: { id: req.body.categoryId }
        });
        if (!category) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Validate subcategory if provided
        if (req.body.subcategoryId) {
            const subcategory = await prisma.subcategory.findUnique({
                where: { id: req.body.subcategoryId }
            });
            if (!subcategory) {
                return res.status(400).json({ error: 'Subcategory not found' });
            }
            if (subcategory.categoryId !== req.body.categoryId) {
                return res.status(400).json({ error: 'Subcategory does not belong to the selected category' });
            }
        }

        // Validate brand if provided
        if (req.body.brandId) {
            const brand = await prisma.brand.findUnique({
                where: { id: req.body.brandId }
            });
            if (!brand) {
                return res.status(400).json({ error: 'Brand not found' });
            }
        }

        // Generate slug if not provided
        const slug = req.body.slug || createProductSlug(req.body.name, 'temp');

        // Ensure unique slug
        let finalSlug = slug;
        let counter = 1;
        while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        // Prepare data
        const productData: any = {
            name: req.body.name,
            slug: finalSlug,
            description: req.body.description || null,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId || null,
            brandId: req.body.brandId || null,
            basePrice: req.body.basePrice,
            images: req.body.images ? (typeof req.body.images === 'string' ? req.body.images : JSON.stringify(req.body.images)) : JSON.stringify([]),
            isFeatured: req.body.isFeatured || false,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            rating: req.body.rating || null,
            reviewCount: req.body.reviewCount || 0,
            tags: req.body.tags ? (typeof req.body.tags === 'string' ? req.body.tags : JSON.stringify(req.body.tags)) : null,
            specifications: req.body.specifications ? (typeof req.body.specifications === 'string' ? req.body.specifications : JSON.stringify(req.body.specifications)) : null
        };

        const product = await prisma.product.create({
            data: productData,
            include: {
                category: true,
                subcategory: true,
                brand: true,
                variants: true
            }
        });

        // Transform response
        const transformedProduct = {
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
            tags: product.tags ? JSON.parse(product.tags) : [],
            specifications: product.specifications ? JSON.parse(product.specifications) : {}
        };

        res.status(201).json(transformedProduct);
    } catch (error: any) {
        console.error('Error creating product:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Unique constraint violation' });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT update product
router.put('/:id', [
    param('id').notEmpty().withMessage('Product ID is required'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('basePrice').optional().isInt({ min: 0 }).withMessage('Base price must be a positive integer'),
    validate
], async (req: Request, res: Response) => {
    try {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Validate category if being updated
        if (req.body.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: req.body.categoryId }
            });
            if (!category) {
                return res.status(400).json({ error: 'Category not found' });
            }
        }

        // Validate subcategory if being updated
        if (req.body.subcategoryId) {
            const subcategory = await prisma.subcategory.findUnique({
                where: { id: req.body.subcategoryId }
            });
            if (!subcategory) {
                return res.status(400).json({ error: 'Subcategory not found' });
            }
        }

        // Validate brand if being updated
        if (req.body.brandId) {
            const brand = await prisma.brand.findUnique({
                where: { id: req.body.brandId }
            });
            if (!brand) {
                return res.status(400).json({ error: 'Brand not found' });
            }
        }

        // Generate slug if name is being updated
        let updateData: any = { ...req.body };

        // Remove fields that shouldn't be updated directly or don't exist in schema
        // Instead of deleting, let's construct a clean object to be safe
        const dataToUpdate: any = {
            name: updateData.name,
            description: updateData.description,
            basePrice: updateData.basePrice,
            isFeatured: updateData.isFeatured,
            isActive: updateData.isActive,
            rating: updateData.rating
            // stock removed as it belongs to variants
        };

        // Add optional fields if they exist
        if (updateData.reviewCount !== undefined) dataToUpdate.reviewCount = updateData.reviewCount;

        // Handle JSON fields
        if (updateData.images) {
            dataToUpdate.images = typeof updateData.images === 'string' ? updateData.images : JSON.stringify(updateData.images);
        }
        if (updateData.tags) {
            dataToUpdate.tags = typeof updateData.tags === 'string' ? updateData.tags : JSON.stringify(updateData.tags);
        }
        if (updateData.specifications) {
            dataToUpdate.specifications = typeof updateData.specifications === 'string' ? updateData.specifications : JSON.stringify(updateData.specifications);
        }

        if (req.body.name && !req.body.slug) {
            dataToUpdate.slug = createProductSlug(req.body.name, req.params.id);

            // Ensure unique slug
            let finalSlug = dataToUpdate.slug;
            let counter = 1;
            while (await prisma.product.findFirst({
                where: {
                    slug: finalSlug,
                    NOT: { id: req.params.id }
                }
            })) {
                finalSlug = `${dataToUpdate.slug}-${counter}`;
                counter++;
            }
            dataToUpdate.slug = finalSlug;
        } else if (req.body.slug) {
            dataToUpdate.slug = req.body.slug;
        }

        // Handle relations via connect
        // We must NOT pass categoryId directly if we want to be safe, or we pass it if it's a scalar.
        // Prisma usually allows scalar updates. The error "Unknown argument categoryId" is suspicious.
        // It implies categoryId is NOT a scalar field in the update input? 
        // In Prisma schema: categoryId String. It IS a scalar.
        // Why did it fail? 
        // Maybe because we passed BOTH categoryId AND category (which we tried to delete but maybe failed)?
        // Or maybe the type generated for update doesn't include scalars if relations are present? Unlikely.
        // Let's try to use 'category: { connect: ... }' which is the most robust way.

        if (req.body.categoryId) {
            dataToUpdate.category = { connect: { id: req.body.categoryId } };
        }
        if (req.body.subcategoryId) {
            dataToUpdate.subcategory = { connect: { id: req.body.subcategoryId } };
        } else if (req.body.subcategoryId === null) {
            dataToUpdate.subcategory = { disconnect: true };
        }

        if (req.body.brandId) {
            dataToUpdate.brand = { connect: { id: req.body.brandId } };
        } else if (req.body.brandId === null) {
            dataToUpdate.brand = { disconnect: true };
        }

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: dataToUpdate,
            include: {
                category: true,
                subcategory: true,
                brand: true,
                variants: true
            }
        });

        // Transform response
        const transformedProduct = {
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
            tags: product.tags ? JSON.parse(product.tags) : [],
            specifications: product.specifications ? JSON.parse(product.specifications) : {}
        };

        res.json(transformedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Unique constraint violation' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product
router.delete('/:id', [
    param('id').notEmpty().withMessage('Product ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Soft delete by setting isActive to false
        await prisma.product.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
