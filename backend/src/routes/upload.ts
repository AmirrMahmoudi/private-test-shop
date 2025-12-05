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
const storage = sharp
    ? multer.memoryStorage()  // Memory for processing with Sharp
    : multer.diskStorage({    // Disk storage fallback
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

        // If Sharp is available, optimize the image
        if (sharp && req.file.buffer) {
            const filename = `${originalName}-${uniqueSuffix}.webp`;
            const thumbnailFilename = `${originalName}-${uniqueSuffix}-thumb.webp`;

            // Process and optimize main image
            const mainImagePath = path.join(uploadsDir, filename);
            await sharp(req.file.buffer)
                .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: IMAGE_CONFIG.quality })
                .toFile(mainImagePath);

            // Generate thumbnail
            const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
            await sharp(req.file.buffer)
                .resize(IMAGE_CONFIG.thumbnailSize, IMAGE_CONFIG.thumbnailSize, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 70 })
                .toFile(thumbnailPath);

            // Get file sizes for response
            const mainStats = fs.statSync(mainImagePath);
            const thumbStats = fs.statSync(thumbnailPath);

            const protocol = req.protocol;
            const host = req.get('host');
            const imageUrl = `${protocol}://${host}/uploads/${filename}`;
            const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbnailFilename}`;

            return res.json({
                url: imageUrl,
                thumbnail: thumbnailUrl,
                filename: filename,
                originalSize: req.file.size,
                optimizedSize: mainStats.size,
                thumbnailSize: thumbStats.size,
                compressionRatio: Math.round((1 - mainStats.size / req.file.size) * 100) + '%',
                optimized: true
            });
        } else {
            // Fallback: save as-is (disk storage already saved the file)
            const filename = req.file.filename || `${originalName}-${uniqueSuffix}${path.extname(req.file.originalname)}`;

            const protocol = req.protocol;
            const host = req.get('host');
            const imageUrl = `${protocol}://${host}/uploads/${filename}`;

            return res.json({
                url: imageUrl,
                filename: filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                optimized: false
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
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
