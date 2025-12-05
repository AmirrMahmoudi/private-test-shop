import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../db';

const router = Router();

// Validation middleware
const validate = (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Helper function to generate slug
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FF\w-]/g, '')
        .substring(0, 50);
};

// GET all categories with subcategories
router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                subcategories: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                },
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });

        // Transform to include subcategories as array for backward compatibility
        const transformedCategories = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            isActive: cat.isActive,
            sortOrder: cat.sortOrder,
            subcategories: cat.subcategories.map(sub => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug
            })),
            productsCount: cat._count.products,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt
        }));

        res.json(transformedCategories);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET category by ID with subcategories
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: req.params.id },
            include: {
                subcategories: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// POST create category
router.post('/', [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        const slug = req.body.slug || generateSlug(req.body.name);

        // Ensure unique slug
        let finalSlug = slug;
        let counter = 1;
        while (await prisma.category.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        const category = await prisma.category.create({
            data: {
                name: req.body.name,
                slug: finalSlug,
                description: req.body.description || null,
                image: req.body.image || null,
                isActive: req.body.isActive !== undefined ? req.body.isActive : true,
                sortOrder: req.body.sortOrder || 0
            },
            include: {
                subcategories: true
            }
        });

        res.status(201).json(category);
    } catch (error: any) {
        console.error('Error creating category:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category name or slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PUT update category
router.put('/:id', [
    param('id').notEmpty().withMessage('Category ID is required'),
    body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id: req.params.id }
        });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let updateData: any = { ...req.body };

        // Remove fields that shouldn't be updated directly or don't exist in schema
        delete updateData.subcategories;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // Generate slug if name is being updated
        if (req.body.name && !req.body.slug) {
            updateData.slug = generateSlug(req.body.name);

            // Ensure unique slug
            let finalSlug = updateData.slug;
            let counter = 1;
            while (await prisma.category.findFirst({
                where: {
                    slug: finalSlug,
                    NOT: { id: req.params.id }
                }
            })) {
                finalSlug = `${updateData.slug}-${counter}`;
                counter++;
            }
            updateData.slug = finalSlug;
        }

        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                subcategories: true
            }
        });

        res.json(category);
    } catch (error: any) {
        console.error('Error updating category:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category name or slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE category (soft delete)
router.delete('/:id', [
    param('id').notEmpty().withMessage('Category ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id: req.params.id }
        });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Soft delete by setting isActive to false
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        res.json({ message: 'Category deleted successfully', category });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// ==================== Subcategory Routes ====================

// GET all subcategories for a category
router.get('/:categoryId/subcategories', async (req: Request, res: Response) => {
    try {
        const subcategories = await prisma.subcategory.findMany({
            where: {
                categoryId: req.params.categoryId,
                isActive: true
            },
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        res.json(subcategories);
    } catch (error: any) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

// POST create subcategory
router.post('/:categoryId/subcategories', [
    param('categoryId').notEmpty().withMessage('Category ID is required'),
    body('name').trim().notEmpty().withMessage('Subcategory name is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        // Validate category exists
        const category = await prisma.category.findUnique({
            where: { id: req.params.categoryId }
        });
        if (!category) {
            return res.status(400).json({ error: 'Category not found' });
        }

        const slug = req.body.slug || generateSlug(req.body.name);

        // Ensure unique slug within category
        let finalSlug = slug;
        let counter = 1;
        while (await prisma.subcategory.findFirst({
            where: {
                categoryId: req.params.categoryId,
                slug: finalSlug
            }
        })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        const subcategory = await prisma.subcategory.create({
            data: {
                name: req.body.name,
                slug: finalSlug,
                categoryId: req.params.categoryId,
                isActive: req.body.isActive !== undefined ? req.body.isActive : true,
                sortOrder: req.body.sortOrder || 0
            }
        });

        res.status(201).json(subcategory);
    } catch (error: any) {
        console.error('Error creating subcategory:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Subcategory slug already exists in this category' });
        }
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
});

// PUT update subcategory
router.put('/subcategories/:id', [
    param('id').notEmpty().withMessage('Subcategory ID is required'),
    body('name').optional().trim().notEmpty().withMessage('Subcategory name cannot be empty'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: { id: req.params.id }
        });

        if (!existingSubcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        let updateData: any = { ...req.body };

        // Generate slug if name is being updated
        if (req.body.name && !req.body.slug) {
            updateData.slug = generateSlug(req.body.name);

            // Ensure unique slug within category
            let finalSlug = updateData.slug;
            let counter = 1;
            while (await prisma.subcategory.findFirst({
                where: {
                    categoryId: existingSubcategory.categoryId,
                    slug: finalSlug,
                    NOT: { id: req.params.id }
                }
            })) {
                finalSlug = `${updateData.slug}-${counter}`;
                counter++;
            }
            updateData.slug = finalSlug;
        }

        const subcategory = await prisma.subcategory.update({
            where: { id: req.params.id },
            data: updateData
        });

        res.json(subcategory);
    } catch (error: any) {
        console.error('Error updating subcategory:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Subcategory slug already exists in this category' });
        }
        res.status(500).json({ error: 'Failed to update subcategory' });
    }
});

// DELETE subcategory (soft delete)
router.delete('/subcategories/:id', [
    param('id').notEmpty().withMessage('Subcategory ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: { id: req.params.id }
        });

        if (!existingSubcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // Soft delete by setting isActive to false
        const subcategory = await prisma.subcategory.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        res.json({ message: 'Subcategory deleted successfully', subcategory });
    } catch (error: any) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ error: 'Failed to delete subcategory' });
    }
});

export default router;
