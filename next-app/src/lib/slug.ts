/**
 * تبدیل نام فارسی به slug برای URL
 */
export function createSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    // تبدیل فاصله‌ها به خط تیره
    .replace(/\s+/g, '-')
    // حذف کاراکترهای خاص
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9-]/g, '')
    // حذف خط تیره‌های تکراری
    .replace(/-+/g, '-')
    // حذف خط تیره از ابتدا و انتها
    .replace(/^-+|-+$/g, '');
}

/**
 * تبدیل نام فارسی به slug با استفاده از ID در صورت نیاز
 */
export function createProductSlug(name: string, id: string): string {
  const baseSlug = createSlug(name);
  // اگر slug خالی شد، از ID استفاده می‌کنیم
  return baseSlug || id.slice(0, 8);
}



