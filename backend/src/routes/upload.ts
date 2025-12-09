// import { Router, Request, Response } from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

// const router = Router();

// // Try to import sharp (optional dependency)
// let sharp: typeof import('sharp') | null = null;
// try {
//     sharp = require('sharp');
//     console.log('✅ Sharp loaded - Image optimization enabled');
// } catch (e) {
//     console.log('⚠️ Sharp not available - Images will be saved without optimization');
// }

// // Ensure uploads directories exist
// const uploadsDir = path.join(__dirname, '../../public/uploads');
// const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }
// if (!fs.existsSync(thumbnailsDir)) {
//     fs.mkdirSync(thumbnailsDir, { recursive: true });
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadsDir),
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         const nameWithoutExt = path.basename(file.originalname, ext);
//         cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
//     }
// });

// // File filter to allow only images
// const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB limit
//     }
// });

// // Image optimization settings
// const IMAGE_CONFIG = {
//     maxWidth: 1200,
//     maxHeight: 1200,
//     quality: 80,
//     thumbnailSize: 300
// };

// // POST upload single image - PROTECTED with auth + optional optimization
// router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'هیچ فایلی آپلود نشد' });
//         }

//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));

//         const protocol = req.protocol;
//         const host = req.get('host');

//         // Path handling
//         const originalPath = req.file.path; // Saved by multer
//         const uploadedFilename = req.file.filename;

//         // If Sharp is available, optimize the image
//         if (sharp) {
//             const optimizedFilename = `${originalName}-${uniqueSuffix}.webp`;
//             const thumbnailFilename = `${originalName}-${uniqueSuffix}-thumb.webp`;

//             const optimizedPath = path.join(uploadsDir, optimizedFilename);
//             const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

//             // Process and optimize main image from DISK
//             await sharp(originalPath)
//                 .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
//                     fit: 'inside',
//                     withoutEnlargement: true
//                 })
//                 .webp({ quality: IMAGE_CONFIG.quality })
//                 .toFile(optimizedPath);

//             // Generate thumbnail
//             await sharp(originalPath)
//                 .resize(IMAGE_CONFIG.thumbnailSize, IMAGE_CONFIG.thumbnailSize, {
//                     fit: 'cover',
//                     position: 'center'
//                 })
//                 .webp({ quality: 70 })
//                 .toFile(thumbnailPath);

//             // Remove the original unoptimized file to save space
//             try {
//                 fs.unlinkSync(originalPath);
//             } catch (err) {
//                 console.warn('Failed to delete original file:', err);
//             }

//             // Get file sizes for response
//             const mainStats = fs.statSync(optimizedPath);
//             const thumbStats = fs.statSync(thumbnailPath);

//             const imageUrl = `${protocol}://${host}/uploads/${optimizedFilename}`;
//             const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbnailFilename}`;

//             return res.json({
//                 url: imageUrl,
//                 thumbnail: thumbnailUrl,
//                 filename: optimizedFilename,
//                 originalSize: req.file.size,
//                 optimizedSize: mainStats.size,
//                 thumbnailSize: thumbStats.size,
//                 compressionRatio: Math.round((1 - mainStats.size / req.file.size) * 100) + '%',
//                 optimized: true
//             });
//         } else {
//             // Fallback: file is already saved as-is
//             const imageUrl = `${protocol}://${host}/uploads/${uploadedFilename}`;

//             return res.json({
//                 url: imageUrl,
//                 filename: uploadedFilename,
//                 size: req.file.size,
//                 mimetype: req.file.mimetype,
//                 optimized: false
//             });
//         }
//     } catch (error) {
//         console.error('Upload error:', error);
//         // Clean up checking
//         if (req.file && req.file.path && fs.existsSync(req.file.path)) {
//             try { fs.unlinkSync(req.file.path); } catch (e) { }
//         }
//         res.status(500).json({ error: 'خطا در آپلود فایل' });
//     }
// });

// // DELETE uploaded image - PROTECTED with auth
// router.delete('/:filename', authMiddleware, (req: AuthRequest, res: Response) => {
//     try {
//         const filename = req.params.filename;
//         const filepath = path.join(uploadsDir, filename);

//         // Try to find thumbnail (with various extensions)
//         const baseName = path.basename(filename, path.extname(filename));
//         const thumbnailPath = path.join(thumbnailsDir, `${baseName}-thumb.webp`);

//         let deleted = false;

//         if (fs.existsSync(filepath)) {
//             fs.unlinkSync(filepath);
//             deleted = true;
//         }

//         if (fs.existsSync(thumbnailPath)) {
//             fs.unlinkSync(thumbnailPath);
//         }

//         if (deleted) {
//             res.json({ message: 'فایل با موفقیت حذف شد' });
//         } else {
//             res.status(404).json({ error: 'فایل یافت نشد' });
//         }
//     } catch (error) {
//         console.error('Delete error:', error);
//         res.status(500).json({ error: 'خطا در حذف فایل' });
//     }
// });

// export default router;

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

// --- FIX START: Sanitize Filename Logic ---
// تابع جدید برای تمیز کردن و ساخت اسم فایل
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        // 1. گرفتن پسوند فایل (مثلاً .jpg)
        const ext = path.extname(file.originalname);
        
        // 2. ساخت یک اسم رندوم و تمیز بر اساس زمان
        // مثال خروجی: img-1702123456789-83748.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanName = `img-${uniqueSuffix}${ext}`;
        
        cb(null, cleanName);
    }
});
// --- FIX END ---

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

        // استفاده از همان اسمی که multer ساخته است (چون اسم اصلی دیگر معتبر نیست)
        const uploadedFilename = req.file.filename;
        const nameWithoutExt = path.basename(uploadedFilename, path.extname(uploadedFilename));

        const protocol = req.protocol;
        const host = req.get('host');

        // Path handling
        const originalPath = req.file.path; // Saved by multer

        // If Sharp is available, optimize the image
        if (sharp) {
            // اسم فایل‌های بهینه شده
            const optimizedFilename = `opt-${nameWithoutExt}.webp`;
            const thumbnailFilename = `thumb-${nameWithoutExt}.webp`;

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

            // ساخت URL نهایی برای دیتابیس
            const imageUrl = `${protocol}://${host}/uploads/${optimizedFilename}`;
            const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbnailFilename}`;

            return res.json({
                url: imageUrl, // این چیزی است که در دیتابیس ذخیره می‌شود
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
        // امنیت: جلوگیری از Directory Traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
             return res.status(400).json({ error: 'نام فایل نامعتبر است' });
        }

        const filepath = path.join(uploadsDir, filename);

        // تلاش برای پیدا کردن نام تامنیل احتمالی
        // چون فرمت نامگذاری تغییر کرده، باید هوشمندانه عمل کنیم یا هر دو فرمت قدیم و جدید را چک کنیم
        let thumbnailPath = '';
        
        if (filename.startsWith('opt-')) {
             // فرمت جدید: opt-NAME.webp -> thumb-NAME.webp
             const baseName = filename.replace('opt-', '').replace('.webp', '');
             thumbnailPath = path.join(thumbnailsDir, `thumb-${baseName}.webp`);
        } else {
             // فرمت قدیمی
             const baseName = path.basename(filename, path.extname(filename));
             thumbnailPath = path.join(thumbnailsDir, `${baseName}-thumb.webp`);
        }

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