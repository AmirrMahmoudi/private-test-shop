
import { Router } from 'express';
import { PrismaClient } from "@prisma/client/index";
const router = Router();
const prisma = new PrismaClient();

// Get active festival (for frontend)
router.get('/active', async (req, res) => {
    try {
        const festival = await prisma.festival.findFirst({
            where: {
                isActive: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: new Date() } }
                ],
                AND: [
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: new Date() } }
                        ]
                    }
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        res.json(festival);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active festival' });
    }
});

// Get all festivals (for admin)
router.get('/', async (req, res) => {
    try {
        const festivals = await prisma.festival.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(festivals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch festivals' });
    }
});

// Create festival
router.post('/', async (req, res) => {
    try {
        const { title, description, image, startDate, endDate, buttonText, link, isActive } = req.body;
        const festival = await prisma.festival.create({
            data: {
                title,
                description,
                image,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                buttonText,
                link,
                isActive: isActive !== undefined ? isActive : true
            }
        });
        res.json(festival);
    } catch (error) {
        console.error('Create festival error:', error);
        res.status(500).json({ error: 'Failed to create festival' });
    }
});

// Update festival
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, startDate, endDate, buttonText, link, isActive } = req.body;

        const festival = await prisma.festival.update({
            where: { id },
            data: {
                title,
                description,
                image,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                buttonText,
                link,
                isActive
            }
        });
        res.json(festival);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update festival' });
    }
});

// Delete festival
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.festival.delete({
            where: { id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete festival' });
    }
});

export default router;
