import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'beauty-shop-secret-key-2024';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'توکن احراز هویت یافت نشد' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            role: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'توکن نامعتبر یا منقضی شده است' });
    }
};

// Optional auth - doesn't block if no token, but adds user if valid
export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as {
                id: string;
                email: string;
                role: string;
            };
            req.user = decoded;
        }
        next();
    } catch (error) {
        // Token invalid but continue anyway
        next();
    }
};

export default authMiddleware;
