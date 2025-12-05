import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'beauty-shop-secret-key-2024';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// POST /api/auth/login - Admin login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است' });
        }

        // Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
        }

        if (!admin.isActive) {
            return res.status(403).json({ error: 'این حساب کاربری غیرفعال است' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'خطای سرور در ورود به سیستم' });
    }
});

// GET /api/auth/verify - Verify token and get user info
router.get('/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true
            }
        });

        if (!admin || !admin.isActive) {
            return res.status(401).json({ error: 'کاربر یافت نشد یا غیرفعال است' });
        }

        res.json({ user: admin });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'خطای سرور' });
    }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
    // JWT is stateless, so logout is handled client-side
    // This endpoint exists for logging purposes
    res.json({ message: 'خروج موفقیت‌آمیز' });
});

// POST /api/auth/setup - Create initial admin (run once)
router.post('/setup', async (req: Request, res: Response) => {
    try {
        // Check if any admin exists
        const existingAdmin = await prisma.admin.findFirst();

        if (existingAdmin) {
            return res.status(400).json({ error: 'ادمین قبلاً ایجاد شده است' });
        }

        // Create default admin
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.admin.create({
            data: {
                email: 'admin@beauty.shop',
                password: hashedPassword,
                name: 'مدیر سیستم',
                role: 'super-admin',
                isActive: true
            }
        });

        res.json({
            message: 'ادمین با موفقیت ایجاد شد',
            email: admin.email
        });

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: 'خطای سرور در ایجاد ادمین' });
    }
});

export default router;
