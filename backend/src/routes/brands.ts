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

// GET all brands
router.get('/', async (req: Request, res: Response) => {
    try {
        const brands = await prisma.brand.findMany({
            where: {
                isActive: true
            },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        res.json(brands);
    } catch (error: any) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
});

// GET single brand by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: req.params.id },
            include: {
                products: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.json(brand);
    } catch (error: any) {
        console.error('Error fetching brand:', error);
        res.status(500).json({ error: 'Failed to fetch brand' });
    }
});

// POST create brand
router.post('/', [
    body('name').trim().notEmpty().withMessage('Brand name is required'),
    body('nameEn').optional().trim(),
    body('logo').optional().trim(),
    body('description').optional().trim(),
    validate
], async (req: Request, res: Response) => {
    try {
        const brand = await prisma.brand.create({
            data: {
                name: req.body.name,
                nameEn: req.body.nameEn || null,
                logo: req.body.logo || null,
                description: req.body.description || null,
                isActive: req.body.isActive !== undefined ? req.body.isActive : true
            }
        });
        res.status(201).json(brand);
    } catch (error: any) {
        console.error('Error creating brand:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Brand name already exists' });
        }
        res.status(500).json({ error: 'Failed to create brand' });
    }
});

// PUT update brand
router.put('/:id', [
    param('id').notEmpty().withMessage('Brand ID is required'),
    body('name').optional().trim().notEmpty().withMessage('Brand name cannot be empty'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingBrand = await prisma.brand.findUnique({
            where: { id: req.params.id }
        });
        
        if (!existingBrand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        const brand = await prisma.brand.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(brand);
    } catch (error: any) {
        console.error('Error updating brand:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Brand name already exists' });
        }
        res.status(500).json({ error: 'Failed to update brand' });
    }
});

// DELETE brand (soft delete by setting isActive to false)
router.delete('/:id', [
    param('id').notEmpty().withMessage('Brand ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        const existingBrand = await prisma.brand.findUnique({
            where: { id: req.params.id }
        });
        
        if (!existingBrand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        // Soft delete by setting isActive to false
        const brand = await prisma.brand.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.json({ message: 'Brand deactivated successfully', brand });
    } catch (error: any) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
});

export default router;






