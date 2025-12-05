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

// GET active hero slides (multiple)
router.get('/slides', async (req: Request, res: Response) => {
    try {
        const heroes = await prisma.hero.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' } // Ensure prisma schema has sortOrder or use updatedAt
        });

        // Fallback if no schema sortOrder (it was in the file I read earlier? Let's check. Yes, sortOrder Int @default(0)).

        if (heroes.length === 0) {
            // Return default hero array
            return res.json([{
                id: 'default',
                title: 'زیبایی طبیعی خود را با محصولات ما کشف کنید',
                subtitle: 'مجموعه‌ای از بهترین لوازم آرایشی، مراقبت پوست و مو برای درخشش شما.',
                image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop',
                button1Text: 'خرید کنید',
                button1Link: '/products',
                isActive: true
            }]);
        }

        res.json(heroes);
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
});

// GET active hero (legacy/single)
router.get('/', async (req: Request, res: Response) => {
    try {
        const hero = await prisma.hero.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });

        if (!hero) {
            // Return default hero if none exists
            return res.json({
                id: 'default',
                title: 'زیبایی طبیعی خود را با محصولات ما کشف کنید',
                subtitle: 'مجموعه‌ای از بهترین لوازم آرایشی، مراقبت پوست و مو برای درخشش شما. کیفیت اصیل، قیمت مناسب.',
                image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop',
                button1Text: 'خرید کنید',
                button1Link: '/products',
                button2Text: 'مراقبت پوست',
                button2Link: '/products?category=skincare',
                isActive: true
            });
        }

        res.json(hero);
    } catch (error) {
        console.error('Error fetching hero:', error);
        res.status(500).json({ error: 'Failed to fetch hero' });
    }
});

// GET hero by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const hero = await prisma.hero.findUnique({
            where: { id: req.params.id }
        });

        if (!hero) {
            return res.status(404).json({ error: 'Hero not found' });
        }

        res.json(hero);
    } catch (error) {
        console.error('Error fetching hero:', error);
        res.status(500).json({ error: 'Failed to fetch hero' });
    }
});

// GET all heroes
router.get('/all/list', async (req: Request, res: Response) => {
    try {
        const heroes = await prisma.hero.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(heroes);
    } catch (error) {
        console.error('Error fetching heroes:', error);
        res.status(500).json({ error: 'Failed to fetch heroes' });
    }
});

// POST create new hero
router.post('/', [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('subtitle').trim().notEmpty().withMessage('Subtitle is required'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    validate
], async (req: Request, res: Response) => {
    try {
        // Logic to deactivate other heroes removed to support multiple slides


        const hero = await prisma.hero.create({
            data: req.body
        });

        res.status(201).json(hero);
    } catch (error) {
        console.error('Error creating hero:', error);
        res.status(500).json({ error: 'Failed to create hero' });
    }
});

// PUT update hero
router.put('/:id', [
    param('id').notEmpty().withMessage('Hero ID is required'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('subtitle').optional().trim().notEmpty().withMessage('Subtitle cannot be empty'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    validate
], async (req: Request, res: Response) => {
    try {
        // If activating this hero, deactivate all others
        // Logic to deactivate other heroes removed to support multiple slides


        const hero = await prisma.hero.update({
            where: { id: req.params.id },
            data: req.body
        });

        res.json(hero);
    } catch (error) {
        console.error('Error updating hero:', error);
        res.status(500).json({ error: 'Failed to update hero' });
    }
});

// DELETE hero
router.delete('/:id', [
    param('id').notEmpty().withMessage('Hero ID is required'),
    validate
], async (req: Request, res: Response) => {
    try {
        await prisma.hero.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Hero deleted successfully' });
    } catch (error) {
        console.error('Error deleting hero:', error);
        res.status(500).json({ error: 'Failed to delete hero' });
    }
});

export default router;
