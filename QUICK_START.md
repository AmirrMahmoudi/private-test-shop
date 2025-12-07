# راهنمای سریع راه‌اندازی

## مشکل: بکند در حال اجرا نیست یا داده نمی‌دهد

### مرحله 1: راه‌اندازی Backend

```bash
# رفتن به پوشه backend
cd backend

# نصب dependencies (اگر نصب نشده)
npm install
# یا
pnpm install

# اجرای migration (اگر اجرا نشده)
npx prisma migrate dev

# اجرای seed (اگر داده‌ها نیست)
npx prisma db seed

# اجرای سرور
npm run dev
```

**بکند باید روی پورت 5000 اجرا شود**

### مرحله 2: تست Backend

در مرورگر یا terminal:
```bash
curl http://localhost:5000/api/health
```

باید این پاسخ را ببینید:
```json
{"status":"ok","message":"Beauty Shop Backend API",...}
```

### مرحله 3: راه‌اندازی Frontend

در یک terminal جدید:
```bash
cd next-app
npm install  # اگر نصب نشده
npm run dev
```

**Frontend روی پورت 3000 اجرا می‌شود**

### مرحله 4: راه‌اندازی Admin Panel

در یک terminal جدید:
```bash
cd admin-panel
npm install  # اگر نصب نشده
npm run dev
```

**Admin Panel روی پورت 3001 اجرا می‌شود**

## مشکلات رایج

### مشکل 1: بکند crash می‌کند

**علت:** ممکن است migration اجرا نشده باشد

**راه حل:**
```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### مشکل 2: ارور 429 (Rate Limiting)

**علت:** Rate limiting فعال است

**راه حل:** Rate limiting در development غیرفعال است. اگر هنوز مشکل دارید:
1. بکند را restart کنید
2. مطمئن شوید `NODE_ENV` تنظیم نشده یا `development` است

### مشکل 3: داده‌ها نمایش داده نمی‌شوند

**علت:** Seed اجرا نشده

**راه حل:**
```bash
cd backend
npx prisma db seed
```

### مشکل 4: CORS Error

**علت:** CORS درست تنظیم نشده

**راه حل:** بررسی کنید که در `backend/src/index.ts`:
```typescript
corsOrigins = ['http://localhost:3000', 'http://localhost:3001']
```

## بررسی سریع

```bash
# بررسی بکند
curl http://localhost:5000/api/health

# بررسی محصولات
curl http://localhost:5000/api/products

# بررسی دسته‌بندی‌ها
curl http://localhost:5000/api/categories

# بررسی برندها
curl http://localhost:5000/api/brands
```

## نکات مهم

1. **همیشه ابتدا بکند را اجرا کنید** - Frontend و Admin Panel به بکند نیاز دارند
2. **پورت‌ها:**
   - Backend: 5000
   - Frontend: 3000  
   - Admin Panel: 3001
3. **اگر بکند crash می‌کند:** Console را بررسی کنید و خطاها را ببینید
4. **اگر داده‌ها نیست:** Seed را دوباره اجرا کنید

## دستورات مفید

```bash
# Reset کامل دیتابیس
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
npx prisma db seed

# مشاهده دیتابیس
npx prisma studio

# بررسی وضعیت migration
npx prisma migrate status
```






