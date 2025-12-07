# راهنمای راه‌اندازی پروژه

## مشکلات رفع شده

✅ همه پورت‌ها از 5001 به 5000 تغییر یافتند
✅ Seed به ساختار جدید به‌روزرسانی شد
✅ API endpoints به‌روزرسانی شدند

## مراحل راه‌اندازی

### 1. راه‌اندازی Backend

```bash
cd backend
npm install
# یا
pnpm install

# اجرای migration
npx prisma migrate dev

# اجرای seed برای پر کردن دیتابیس
npx prisma db seed

# اجرای سرور
npm run dev
# یا
pnpm dev
```

بکند روی پورت **5000** اجرا می‌شود.

### 2. راه‌اندازی Frontend (Next App)

```bash
cd next-app
npm install
# یا
pnpm install

# اجرای سرور
npm run dev
# یا
pnpm dev
```

Frontend روی پورت **3000** اجرا می‌شود.

### 3. راه‌اندازی Admin Panel

```bash
cd admin-panel
npm install
# یا
pnpm install

# اجرای سرور
npm run dev
# یا
pnpm dev
```

Admin Panel روی پورت **3001** اجرا می‌شود.

## بررسی مشکلات

### اگر بکند بالا نمی‌آید:

1. بررسی کنید که پورت 5000 آزاد است:
```bash
lsof -i :5000
```

2. بررسی کنید که دیتابیس درست setup شده:
```bash
cd backend
npx prisma studio
```

3. بررسی کنید که migration ها اجرا شده‌اند:
```bash
cd backend
npx prisma migrate status
```

### اگر داده‌ها نمایش داده نمی‌شوند:

1. Seed را دوباره اجرا کنید:
```bash
cd backend
npx prisma db seed
```

2. بررسی کنید که seed درست اجرا شده:
```bash
cd backend
npx prisma studio
```

### اگر API Error می‌دهد:

1. بررسی کنید که بکند در حال اجرا است:
   - باز کردن `http://localhost:5000/api/health`
   - باید `{"status":"ok"}` برگرداند

2. بررسی کنید که URL درست است:
   - Frontend باید به `http://localhost:5000/api` درخواست بزند
   - نه `http://localhost:5001/api`

## ساختار جدید

### Brands
- برندها به صورت جداگانه در جدول `Brand` ذخیره می‌شوند
- هر محصول به یک برند لینک می‌شود با `brandId`

### Subcategories
- زیردسته‌ها به صورت جداگانه در جدول `Subcategory` ذخیره می‌شوند
- هر زیردسته به یک دسته لینک می‌شود با `categoryId`

### Products
- استفاده از `basePrice` به جای `price`
- استفاده از `images` (JSON array) به جای `image` (string)
- استفاده از `categoryId` و `subcategoryId` به جای string
- استفاده از `brandId` به جای string

### Variants
- هر محصول می‌تواند چندین variant داشته باشد
- Variant پیش‌فرض برای هر محصول در seed ایجاد می‌شود

## تست API

```bash
# تست health
curl http://localhost:5000/api/health

# تست products
curl http://localhost:5000/api/products

# تست categories
curl http://localhost:5000/api/categories

# تست brands
curl http://localhost:5000/api/brands
```

## نکات مهم

1. **پورت‌ها:**
   - Backend: 5000
   - Frontend: 3000
   - Admin Panel: 3001

2. **Environment Variables:**
   - اگر نیاز به تغییر پورت دارید، از environment variables استفاده کنید
   - `NEXT_PUBLIC_API_URL` برای frontend
   - `INTERNAL_API_URL` برای server-side calls

3. **Database:**
   - SQLite استفاده می‌شود
   - فایل دیتابیس: `backend/dev.db`
   - برای reset: فایل را پاک کنید و migration + seed را دوباره اجرا کنید






