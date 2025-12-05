import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import heroRouter from './routes/hero';
import uploadRouter from './routes/upload';
import brandsRouter from './routes/brands';
import variantsRouter from './routes/variants';
import festivalRouter from './routes/festival';
import authRouter from './routes/auth';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Compression middleware (should be early in the chain)
app.use(compression({
    level: 6,
    threshold: 1024,
}));

// CORS Configuration (must run BEFORE any rate limiting / routes)
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - کاملاً غیرفعال در development
// فقط در production فعال می‌شود
if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.',
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req: Request) => {
            if (req.method === 'OPTIONS') return true;
            if (req.path.startsWith('/api/upload')) return true;
            return false;
        },
    });
    app.use('/api/', limiter);
}

// Stricter rate limiting for POST/PUT/DELETE (در صورت نیاز بعداً استفاده می‌شود)
const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // کمی بالاتر برای محیط توسعه
    message: 'تعداد درخواست‌های تغییر داده بیش از حد مجاز است.',
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/hero', heroRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/variants', variantsRouter);
app.use('/api/festivals', festivalRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Beauty Shop Backend API',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 CORS enabled for: ${corsOrigins.join(', ')}`);
});

export default app;
