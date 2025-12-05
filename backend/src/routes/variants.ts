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

// GET all variants for a product
router.get('/product/:productId', async (req: Request, res: Response) => {
    try {
        const variants = await prisma.productVariant.findMany({
            where: {
                productId: req.params.productId,
                isActive: true
            },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'asc' }
            ]
        });
        res.json(variants);
    } catch (error: any) {
        console.error('Error fetching variants:', error);
        res.status(500).json({ error: 'Failed to fetch variants' });
    }
});

// GET single variant by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const variant = await prisma.productVariant.findUnique({
            where: { id: req.params.id },
            include: {
                product: {
                    include: {
                        category: true,
                        brand: true
                    }
                }
            }
        });

        if (!variant) {
            return res.status(404).json({ error: 'Variant not found' });
        }

        res.json(variant);
    } catch (error: any) {
        console.error('Error fetching variant:', error);
        res.status(500).json({ error: 'Failed to fetch variant' });
    }
});

// POST create variant
router.post('/', [
    body('productId').trim().notEmpty().withMessage('Product ID is required'),
    body('name').trim().notEmpty().withMessage('Variant name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('price').isInt({ min: 0 }).withMessage('Price must be a positive integer'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate
], async (req: Request, res: Response) => {
    try {
        // Validate product exists
        const product = await prisma.product.findUnique({
            where: { id: req.body.productId }
        });
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }

        // Check if SKU already exists
        const existingVariant = await prisma.productVariant.findUnique({
            where: { sku: req.body.sku }
        });
        if (existingVariant) {
            return res.status(400).json({ error: 'SKU already exists' });
        }

        // If this is the first variant or isDefault is true, set others to false
        if (req.body.isDefault) {
            await prisma.productVariant.updateMany({
                where: { productId: req.body.productId },
                data: { isDefault: false }
            });
        } else {
            // If no default variant exists, make this one default
            const defaultCount = await prisma.productVariant.count({
                where: {
                    productId: req.body.productId,
                    isDefault: true
                }
            });
            if (defaultCount === 0) {
                req.body.isDefault = true;
            }
        }

        const variant = await prisma.productVariant.create({
            data: {
                productId: req.body.productId,
                name: req.body.name,
                sku: req.body.sku,
                color: req.body.color || null,
                colorCode: req.body.colorCode || null,
                size: req.body.size || null,
                price: req.body.price,
                comparePrice: req.body.comparePrice || null,
                stock: req.body.stock || 0,
                image: req.body.image || null,
                isDefault: req.body.isDefault || false,
                isActive: req.body.isActive !== undefined ? req.body.isActive : true
            },
            include: {
                product: true
            }
        });

        res.status(201).json(variant);
    } catch (error: any) {
        console.error('Error creating variant:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'SKU already exists' });
        }
        res.status(500).json({ error: 'Failed to create variant' });
    }
});

// PUT update variant
router.put('/:id', [
    param('id').notEmpty().withMessage('Variant ID is required'),
    body('price').optional().isInt({ min: 0 }).withMessage('Price must be a positive integer'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingVariant = await prisma.productVariant.findUnique({
            where: { id: req.params.id }
        });
        
        if (!existingVariant) {
            return res.status(404).json({ error: 'Variant not found' });
        }

        // If setting as default, unset others
        if (req.body.isDefault === true) {
            await prisma.productVariant.updateMany({
                where: {
                    productId: existingVariant.productId,
                    NOT: { id: req.params.id }
                },
                data: { isDefault: false }
            });
        }

        // Check SKU uniqueness if being updated
        if (req.body.sku && req.body.sku !== existingVariant.sku) {
            const skuExists = await prisma.productVariant.findUnique({
                where: { sku: req.body.sku }
            });
            if (skuExists) {
                return res.status(400).json({ error: 'SKU already exists' });
            }
        }

        const variant = await prisma.productVariant.update({
            where: { id: req.params.id },
            data: req.body
        });

        res.json(variant);
    } catch (error: any) {
        console.error('Error updating variant:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'SKU already exists' });
        }
        res.status(500).json({ error: 'Failed to update variant' });
    }
});

// DELETE variant (soft delete)
router.delete('/:id', [
    param('id').notEmpty().withMessage('Variant ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingVariant = await prisma.productVariant.findUnique({
            where: { id: req.params.id }
        });
        
        if (!existingVariant) {
            return res.status(404).json({ error: 'Variant not found' });
        }

        // Soft delete by setting isActive to false
        const variant = await prisma.productVariant.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        res.json({ message: 'Variant deleted successfully', variant });
    } catch (error: any) {
        console.error('Error deleting variant:', error);
        res.status(500).json({ error: 'Failed to delete variant' });
    }
});

export default router;





