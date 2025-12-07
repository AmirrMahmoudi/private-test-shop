import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Try to import sharp (optional dependency)
let sharp: typeof import('sharp') | null = null;
try {
    sharp = require('sharp');
    console.log('✅ Sharp loaded - Image optimization enabled');
} catch (e) {
    console.log('⚠️ Sharp not available - Images will be saved without optimization');
}

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, '../../public/uploads');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Image optimization settings
const IMAGE_CONFIG = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    thumbnailSize: 300
};

// POST upload single image - PROTECTED with auth + optional optimization
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'هیچ فایلی آپلود نشد' });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));

        const protocol = req.protocol;
        const host = req.get('host');

        // Path handling
        const originalPath = req.file.path; // Saved by multer
        const uploadedFilename = req.file.filename;

        // If Sharp is available, optimize the image
        if (sharp) {
            const optimizedFilename = `${originalName}-${uniqueSuffix}.webp`;
            const thumbnailFilename = `${originalName}-${uniqueSuffix}-thumb.webp`;

            const optimizedPath = path.join(uploadsDir, optimizedFilename);
            const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

            // Process and optimize main image from DISK
            await sharp(originalPath)
                .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: IMAGE_CONFIG.quality })
                .toFile(optimizedPath);

            // Generate thumbnail
            await sharp(originalPath)
                .resize(IMAGE_CONFIG.thumbnailSize, IMAGE_CONFIG.thumbnailSize, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 70 })
                .toFile(thumbnailPath);

            // Remove the original unoptimized file to save space
            try {
                fs.unlinkSync(originalPath);
            } catch (err) {
                console.warn('Failed to delete original file:', err);
            }

            // Get file sizes for response
            const mainStats = fs.statSync(optimizedPath);
            const thumbStats = fs.statSync(thumbnailPath);

            const imageUrl = `${protocol}://${host}/uploads/${optimizedFilename}`;
            const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbnailFilename}`;

            return res.json({
                url: imageUrl,
                thumbnail: thumbnailUrl,
                filename: optimizedFilename,
                originalSize: req.file.size,
                optimizedSize: mainStats.size,
                thumbnailSize: thumbStats.size,
                compressionRatio: Math.round((1 - mainStats.size / req.file.size) * 100) + '%',
                optimized: true
            });
        } else {
            // Fallback: file is already saved as-is
            const imageUrl = `${protocol}://${host}/uploads/${uploadedFilename}`;

            return res.json({
                url: imageUrl,
                filename: uploadedFilename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                optimized: false
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        // Clean up checking
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        res.status(500).json({ error: 'خطا در آپلود فایل' });
    }
});

// DELETE uploaded image - PROTECTED with auth
router.delete('/:filename', authMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadsDir, filename);

        // Try to find thumbnail (with various extensions)
        const baseName = path.basename(filename, path.extname(filename));
        const thumbnailPath = path.join(thumbnailsDir, `${baseName}-thumb.webp`);

        let deleted = false;

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            deleted = true;
        }

        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }

        if (deleted) {
            res.json({ message: 'فایل با موفقیت حذف شد' });
        } else {
            res.status(404).json({ error: 'فایل یافت نشد' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'خطا در حذف فایل' });
    }
});

export default router;
