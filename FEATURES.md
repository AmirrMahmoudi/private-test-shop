# 📋 ویژگی‌های کامل پروژه فروشگاه لوازم آرایشی

## 🎯 نمای کلی پروژه

این پروژه یک فروشگاه آنلاین کامل برای فروش لوازم آرایشی و بهداشتی است که شامل سه بخش اصلی می‌باشد:

1. **Frontend (Customer App)** - رابط کاربری برای مشتریان
2. **Admin Panel** - پنل مدیریت برای مدیران فروشگاه
3. **Backend API** - سرویس‌های REST API برای مدیریت داده‌ها

---

## 🏗️ معماری پروژه

### تکنولوژی‌های استفاده شده:

- **Frontend & Admin Panel**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express 5, TypeScript, Prisma ORM
- **Database**: SQLite (قابل ارتقا به PostgreSQL/MySQL)
- **Containerization**: Docker & Docker Compose
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **Notifications**: Sonner (Toast notifications)

---

## 🎨 Frontend (Customer App) - `next-app/`

### معماری Frontend:
- ✅ **Server Components**: تمام صفحات اصلی به صورت Server Components هستند
- ✅ **Dynamic Routes**: استفاده از dynamic routes به جای query parameters
- ✅ **ISR (Incremental Static Regeneration)**: استفاده از revalidation برای cache
- ✅ **Data Fetching**: داده‌ها فقط در Server Components fetch می‌شوند
- ✅ **Client Components**: فقط برای تعاملات کاربری (state, events, hooks)

### صفحات و قابلیت‌ها:

#### 1. **صفحه اصلی (Home Page)** - Server Component
- نمایش Hero Section با تصاویر و دکمه‌های CTA
- نمایش محصولات ویژه (Featured Products)
- نمایش دسته‌بندی‌ها (Category Showcase)
- طراحی Responsive و RTL
- داده‌ها در سمت سرور fetch می‌شوند

#### 2. **صفحه محصولات (Products Page)** - Server Component
- نمایش تمام محصولات با فیلتر بر اساس دسته‌بندی
- جستجو و فیلتر محصولات (در Client Component)
- نمایش جزئیات محصول (نام، قیمت، تصویر، موجودی)
- طراحی کارت‌های محصول با Tailwind CSS
- استفاده از dynamic route: `/products/[category]`
- داده‌های اولیه در Server Component fetch می‌شوند

#### 3. **صفحه جزئیات محصول (Product Detail)** - Server Component
- نمایش کامل اطلاعات محصول
- افزودن به سبد خرید (در Client Component)
- نمایش موجودی و قیمت
- تصاویر محصول
- داده‌ها در Server Component fetch می‌شوند
- SEO metadata generation

#### 4. **سبد خرید (Cart)**
- مدیریت سبد خرید با Context API
- افزودن/حذف محصولات
- تغییر تعداد محصولات
- محاسبه خودکار قیمت کل
- ذخیره در localStorage برای persistence

#### 5. **صفحه تسویه حساب (Checkout)**
- فرم اطلاعات ارسال (نام، نام خانوادگی، تلفن، آدرس)
- انتخاب روش پرداخت (اینترنتی یا پرداخت در محل)
- نمایش خلاصه سفارش
- اعتبارسنجی فرم با React Hook Form
- ثبت سفارش در دیتابیس

#### 6. **صفحات احراز هویت**
- صفحه ورود (Login)
- صفحه ثبت‌نام (Register)
- مدیریت session و authentication

### کامپوننت‌های اصلی:

#### **Navbar** (Server Component + Client Component)
- **NavbarServer**: Server Component که داده‌ها را fetch می‌کند
- **NavbarClient**: Client Component برای تعاملات کاربری
- منوی ناوبری با لینک‌های دسته‌بندی
- نمایش تعداد محصولات در سبد خرید
- دکمه تم (Dark/Light Mode)
- طراحی Responsive با Mobile Menu
- استفاده از dynamic routes برای دسته‌بندی‌ها

#### **Hero Component**
- نمایش بنرهای تبلیغاتی
- پشتیبانی از چندین دکمه CTA
- دریافت داده از API

#### **FeaturedProducts**
- نمایش محصولات ویژه
- کارت‌های محصول با انیمیشن
- لینک به صفحه جزئیات

#### **CategoryShowcase**
- نمایش دسته‌بندی‌ها با تصاویر
- لینک به صفحه محصولات هر دسته

#### **CartContext**
- مدیریت state سبد خرید
- توابع: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- محاسبه `totalItems` و `totalPrice`
- ذخیره در localStorage

### ویژگی‌های UI/UX:

- ✅ طراحی RTL (راست به چپ) برای فارسی
- ✅ Dark Mode / Light Mode با next-themes
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Loading States و Skeleton Loaders
- ✅ Error Handling و نمایش پیام‌های خطا
- ✅ Toast Notifications برای عملیات‌ها
- ✅ انیمیشن‌های نرم با Framer Motion
- ✅ فونت فارسی Vazirmatn

---

## 👨‍💼 Admin Panel - `admin-panel/`

### صفحات و قابلیت‌ها:

#### 1. **داشبورد (Dashboard)**
- نمایش آمار کلی فروشگاه
- نمایش آخرین سفارشات
- نمایش محصولات پرفروش

#### 2. **مدیریت محصولات (Products Management)**
- لیست تمام محصولات
- افزودن محصول جدید
- ویرایش محصول موجود
- حذف محصول
- آپلود تصویر محصول
- مدیریت موجودی (Stock)
- تنظیم محصولات ویژه

#### 3. **مدیریت دسته‌بندی‌ها (Categories Management)**
- لیست دسته‌بندی‌ها
- افزودن دسته جدید
- ویرایش دسته موجود
- حذف دسته
- آپلود تصویر دسته
- مدیریت زیردسته‌ها (Subcategories)

#### 4. **مدیریت Hero Section**
- ایجاد و ویرایش بنرهای Hero
- فعال/غیرفعال کردن Hero
- مدیریت دکمه‌های CTA
- آپلود تصویر Hero

#### 5. **مدیریت سفارشات (Orders Management)**
- نمایش تمام سفارشات
- تغییر وضعیت سفارش (pending, processing, shipped, delivered)
- مشاهده جزئیات سفارش
- نمایش اطلاعات ارسال

#### 6. **تنظیمات (Settings)**
- تنظیمات عمومی فروشگاه
- مدیریت اطلاعات تماس
- تنظیمات پرداخت

### کامپوننت‌های Admin:

#### **Sidebar**
- منوی کناری با لینک‌های صفحات
- طراحی Material Design
- آیکون‌های Lucide React

#### **ImageUpload**
- کامپوننت آپلود تصویر
- پیش‌نمایش تصویر
- پشتیبانی از drag & drop

---

## 🔧 Backend API - `backend/`

### ساختار API:

#### **Base URL**: `http://localhost:5001/api`

### Endpoints:

#### 1. **Products API** - `/api/products`
- `GET /api/products` - دریافت تمام محصولات
- `GET /api/products/:id` - دریافت یک محصول
- `POST /api/products` - ایجاد محصول جدید
- `PUT /api/products/:id` - به‌روزرسانی محصول
- `DELETE /api/products/:id` - حذف محصول

**Validation:**
- نام محصول (required)
- قیمت (required, positive integer)
- تصویر (required)
- دسته‌بندی (required)
- زیردسته (required)
- موجودی (optional, non-negative integer)
- محصول ویژه (optional, boolean)
- امتیاز (optional, 0-5)

#### 2. **Categories API** - `/api/categories`
- `GET /api/categories` - دریافت تمام دسته‌بندی‌ها
- `GET /api/categories/:id` - دریافت یک دسته
- `POST /api/categories` - ایجاد دسته جدید
- `PUT /api/categories/:id` - به‌روزرسانی دسته
- `DELETE /api/categories/:id` - حذف دسته

**Validation:**
- نام دسته (required, unique)
- زیردسته‌ها (required, valid JSON)

#### 3. **Orders API** - `/api/orders`
- `GET /api/orders` - دریافت تمام سفارشات
- `POST /api/orders` - ایجاد سفارش جدید

**Features:**
- بررسی موجودی محصولات قبل از ثبت سفارش
- کاهش خودکار موجودی پس از ثبت سفارش
- ذخیره اطلاعات ارسال (Shipping Info)
- محاسبه قیمت کل

**Validation:**
- آیتم‌های سفارش (required, array)
- قیمت کل (required, positive integer)
- وضعیت سفارش (optional, default: pending)

#### 4. **Hero API** - `/api/hero`
- `GET /api/hero` - دریافت Hero فعال
- `GET /api/hero/:id` - دریافت Hero با ID
- `GET /api/hero/all/list` - دریافت تمام Heroها
- `POST /api/hero` - ایجاد Hero جدید
- `PUT /api/hero/:id` - به‌روزرسانی Hero
- `DELETE /api/hero/:id` - حذف Hero

**Features:**
- فقط یک Hero می‌تواند فعال باشد
- در صورت فعال کردن Hero جدید، Hero قبلی غیرفعال می‌شود
- در صورت عدم وجود Hero فعال، Hero پیش‌فرض برگردانده می‌شود

#### 5. **Upload API** - `/api/upload`
- `POST /api/upload` - آپلود تصویر
- `DELETE /api/upload/:filename` - حذف تصویر

**Features:**
- پشتیبانی از فرمت‌های: JPEG, JPG, PNG, GIF, WEBP
- محدودیت حجم: 5MB
- نام فایل یکتا با timestamp
- ذخیره در `/public/uploads`

### Database Schema (Prisma):

#### **Product Model**
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Int
  image       String
  category    String
  subcategory String
  brand       String?
  description String?
  stock       Int      @default(0)
  isFeatured  Boolean  @default(false)
  rating      Float?
  tags        String?  // JSON string
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### **Category Model**
```prisma
model Category {
  id            String   @id @default(cuid())
  name          String   @unique
  subcategories String   // JSON string array
  image         String?
  createdAt     DateTime @default(now())
}
```

#### **Order Model**
```prisma
model Order {
  id           String   @id @default(cuid())
  items        String   // JSON string
  total        Int
  status       String   @default("pending")
  shippingInfo String?  // JSON string
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### **Hero Model**
```prisma
model Hero {
  id          String   @id @default(cuid())
  title       String
  subtitle    String
  image       String
  button1Text String?
  button1Link String?
  button2Text String?
  button2Link String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### **Admin Model**
```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  role      String   @default("admin")
  createdAt DateTime @default(now())
}
```

### ویژگی‌های Backend:

- ✅ Input Validation با express-validator
- ✅ Error Handling پیشرفته با مدیریت خطاهای Prisma
- ✅ CORS Configuration
- ✅ Compression Middleware
- ✅ Static File Serving برای تصاویر
- ✅ Request Logging
- ✅ Health Check Endpoint
- ✅ بررسی وجود رکورد قبل از Update/Delete
- ✅ مدیریت Stock هنگام ثبت سفارش
- ✅ بررسی موجودی قبل از ثبت سفارش

---

## 🐳 Docker Configuration

### Docker Compose Services:

#### 1. **Backend Service**
- Port: `5001:5000`
- Environment Variables:
  - `NODE_ENV=development`
  - `PORT=5000`
  - `DATABASE_URL=file:/app/prisma/dev.db`
  - `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`
- Volume: `./backend/prisma:/app/prisma` (برای persistence دیتابیس)

#### 2. **Frontend Service**
- Port: `3000:3000`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
  - `INTERNAL_API_URL=http://backend:5000/api`
- Volumes:
  - `./next-app:/app` (hot reload)
  - `/app/node_modules` (exclude)
  - `/app/.next` (exclude)

#### 3. **Admin Panel Service**
- Port: `3001:3001`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
  - `INTERNAL_API_URL=http://backend:5000/api`
- Volumes:
  - `./admin-panel:/app` (hot reload)
  - `/app/node_modules` (exclude)
  - `/app/.next` (exclude)

### Network:
- تمام سرویس‌ها در شبکه `shop-network` قرار دارند
- ارتباط داخلی از طریق نام سرویس (مثلاً `backend:5000`)

---

## 🔒 امنیت و Validation

### Backend Security:

1. **Input Validation**
   - تمام endpointها با express-validator اعتبارسنجی می‌شوند
   - بررسی نوع داده (string, number, boolean)
   - بررسی محدوده مقادیر (min, max)
   - بررسی required fields

2. **Error Handling**
   - مدیریت خطاهای Prisma (P2002, P2025)
   - پیام‌های خطای واضح و مفید
   - Logging خطاها برای debugging

3. **Database Security**
   - استفاده از Prisma ORM برای جلوگیری از SQL Injection
   - Validation در سطح Schema

### Frontend Security:

1. **Form Validation**
   - استفاده از React Hook Form + Zod
   - اعتبارسنجی سمت کلاینت قبل از ارسال

2. **XSS Protection**
   - استفاده از Next.js که به صورت پیش‌فرض XSS را جلوگیری می‌کند
   - Sanitization داده‌های ورودی

---

## 🚀 اجرای پروژه

### پیش‌نیازها:
- Docker & Docker Compose
- Node.js 20+ (برای development محلی)

### اجرا با Docker:

```bash
# اجرای تمام سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down
```

### اجرای محلی (Development):

#### Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Frontend:
```bash
cd next-app
npm install
npm run dev
```

#### Admin Panel:
```bash
cd admin-panel
npm install
npm run dev
```

---

## 📦 پکیج‌های اصلی

### Frontend (`next-app/`):
- `next@15.3.5` - Framework
- `react@19.0.0` - UI Library
- `typescript@5` - Type Safety
- `tailwindcss@4` - CSS Framework
- `framer-motion@12.23.24` - Animations
- `react-hook-form@7.60.0` - Form Management
- `zod@4.1.12` - Schema Validation
- `sonner@2.0.7` - Toast Notifications
- `next-themes@0.4.6` - Theme Management
- `lucide-react@0.552.0` - Icons

### Backend (`backend/`):
- `express@5.1.0` - Web Framework
- `@prisma/client@5.22.0` - ORM
- `express-validator@7.3.1` - Input Validation
- `multer@2.0.2` - File Upload
- `cors@2.8.5` - CORS Middleware
- `compression@1.7.5` - Response Compression
- `bcryptjs@3.0.3` - Password Hashing
- `jsonwebtoken@9.0.2` - JWT Authentication

---

## 🐛 باگ‌های رفع شده

### 1. ✅ باگ فرم Checkout
- **مشکل**: اطلاعات فرم ذخیره نمی‌شد
- **راه‌حل**: افزودن state management برای تمام فیلدها

### 2. ✅ بررسی وجود محصول قبل از Update/Delete
- **مشکل**: خطای نامشخص در صورت عدم وجود محصول
- **راه‌حل**: بررسی وجود محصول قبل از عملیات

### 3. ✅ مدیریت خطا
- **مشکل**: پیام‌های خطای کلی
- **راه‌حل**: مدیریت دقیق خطاهای Prisma و نمایش پیام‌های واضح

### 4. ✅ بررسی Stock هنگام ثبت سفارش
- **مشکل**: سفارش بدون بررسی موجودی ثبت می‌شد
- **راه‌حل**: بررسی موجودی و کاهش خودکار Stock

### 5. ✅ Validation برای Routeها
- **مشکل**: عدم وجود validation
- **راه‌حل**: افزودن express-validator برای تمام endpointها

### 6. ✅ مسیر دیتابیس در Docker
- **مشکل**: مسیر نسبی مشکل ایجاد می‌کرد
- **راه‌حل**: استفاده از مسیر مطلق و volume

### 7. ✅ مشکل Visual Edits Loader
- **مشکل**: خطای `estree-walker` در build
- **راه‌حل**: حذف Visual Edits که برای production نیاز نیست

### 8. ✅ تبدیل Navbar به Server Component
- **مشکل**: Navbar داده‌ها را از بکند در Client Component می‌گرفت
- **راه‌حل**: تبدیل Navbar به Server Component (`NavbarServer`) که داده‌ها را در سمت سرور fetch می‌کند و به Client Component (`NavbarClient`) پاس می‌دهد

### 9. ✅ تبدیل صفحات به Server Components
- **مشکل**: صفحات اصلی از Client Component استفاده می‌کردند و داده‌ها را در سمت کلاینت fetch می‌کردند
- **راه‌حل**: 
  - صفحه اصلی (`page.tsx`) به Server Component تبدیل شد
  - صفحه محصول (`product/[id]/page.tsx`) به Server Component تبدیل شد
  - صفحه محصولات (`products/page.tsx`) به Server Component تبدیل شد
  - فقط بخش‌های تعاملی در Client Components جداگانه قرار گرفتند

### 10. ✅ تبدیل Query Params به Dynamic Routes
- **مشکل**: استفاده از query parameters برای فیلتر دسته‌بندی (`/products?category=skincare`)
- **راه‌حل**: تبدیل به dynamic routes (`/products/skincare`) برای SEO بهتر و URLهای تمیزتر

### 11. ✅ بهبود پنل ادمین
- **مشکل**: توابع Hero API کامل نبودند
- **راه‌حل**: افزودن توابع `fetchHeroById`, `fetchAllHeroes`, `createHero`, `deleteHero` به API

---

## 📝 نکات مهم

### Migration:
پس از تغییر Schema، باید migration ایجاد کنید:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

### Environment Variables:
برای production، متغیرهای محیطی را تنظیم کنید:
- `DATABASE_URL` - آدرس دیتابیس
- `CORS_ORIGINS` - دامنه‌های مجاز
- `JWT_SECRET` - کلید JWT (برای authentication)

### Security Recommendations:
1. افزودن Authentication/Authorization
2. Rate Limiting برای API
3. Input Sanitization بیشتر
4. محدود کردن CORS
5. استفاده از HTTPS در production

---

## 🎯 ویژگی‌های آینده (Roadmap)

- [ ] سیستم احراز هویت کامل (Login/Register)
- [ ] پنل کاربری برای مشتریان
- [ ] سیستم پرداخت آنلاین
- [ ] ارسال ایمیل برای سفارشات
- [ ] سیستم نظرات و امتیازدهی
- [ ] جستجوی پیشرفته محصولات
- [ ] فیلترهای پیشرفته (قیمت، برند، امتیاز)
- [ ] سیستم تخفیف و کدهای تخفیف
- [ ] داشبورد آماری برای Admin
- [ ] سیستم مدیریت موجودی پیشرفته
- [ ] پشتیبانی از چندین زبان
- [ ] سیستم بلاگ و مقالات
- [ ] مقایسه محصولات
- [ ] لیست علاقه‌مندی‌ها

---

## 📞 پشتیبانی

برای سوالات و مشکلات:
- بررسی لاگ‌های Docker: `docker-compose logs`
- بررسی لاگ‌های Backend در console
- بررسی Network Tab در Browser DevTools

---

**آخرین به‌روزرسانی**: دسامبر 2024


