import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

// GET all orders with pagination
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const skip = (page - 1) * limit;
        const status = req.query.status as string | undefined;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: true
                }
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET single order by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                items: true
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error: any) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Helper function to generate order number
function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
}

// POST create order
router.post('/', async (req: Request, res: Response) => {
    try {
        const {
            items,
            subtotal,
            shippingCost = 0,
            discount = 0,
            total,
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            notes
        } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required' });
        }

        if (!total || !customerName || !customerPhone || !shippingAddress) {
            return res.status(400).json({ error: 'Total, customerName, customerPhone, and shippingAddress are required' });
        }

        // Generate unique order number
        let orderNumber = generateOrderNumber();
        let attempts = 0;
        while (await prisma.order.findUnique({ where: { orderNumber } }) && attempts < 10) {
            orderNumber = generateOrderNumber();
            attempts++;
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                subtotal: subtotal || total,
                shippingCost,
                discount,
                total,
                status: 'pending',
                customerName,
                customerPhone,
                customerEmail: customerEmail || null,
                shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
                notes: notes || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        productName: item.productName,
                        variantId: item.variantId || null,
                        variantName: item.variantName || null,
                        sku: item.sku || null,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.price * item.quantity,
                        image: item.image || null
                    }))
                }
            },
            include: {
                items: true
            }
        });

        res.status(201).json(order);
    } catch (error: any) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// PUT update order status
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { status, notes } = req.body;

        const existingOrder = await prisma.order.findUnique({
            where: { id: req.params.id }
        });

        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { notes })
            },
            include: {
                items: true
            }
        });

        res.json(order);
    } catch (error: any) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// DELETE order
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const existingOrder = await prisma.order.findUnique({
            where: { id: req.params.id }
        });

        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Delete order items first (cascade should handle this, but being explicit)
        await prisma.orderItem.deleteMany({
            where: { orderId: req.params.id }
        });

        await prisma.order.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

export default router;
