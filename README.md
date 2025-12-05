# 🛍️ فروشگاه لوازم آرایشی - Beauty Shop

یک پروژه فروشگاهی کامل با معماری Microservices شامل:

- 🖥️ **Backend API** (Node.js + Express + Prisma)
- 🌐 **Frontend** (Next.js - وب‌سایت مشتریان)
- 👨‍💼 **Admin Panel** (Next.js - پنل مدیریت)

---

## 📁 ساختار پروژه

```
shop/
├── backend/          # سرور API و دیتابیس
├── next-app/         # وب‌سایت فروشگاه (مشتریان)
├── admin-panel/      # پنل مدیریت
├── docker-compose.yml
└── README.md
```

---

## 🚀 راه‌اندازی سریع

### پیش‌نیازها

- Node.js 20 یا بالاتر
- npm یا yarn
- (اختیاری) Docker & Docker Compose

### روش ۱: اجرای دستی (بدون Docker)

#### ۱. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed      # ایجاد داده‌های نمونه
npm run dev              # اجرا روی پورت 5000
```

#### ۲. Frontend (Next-App)

```bash
cd next-app
npm install
npm run dev              # اجرا روی پورت 3000
```

#### ۳. Admin Panel

```bash
cd admin-panel
npm install
npm run dev -- -p 3001   # اجرا روی پورت 3001
```

### روش ۲: استفاده از Docker 🐳

```bash
# اجرای همه سرویس‌ها با یک دستور
docker-compose up --build

# اجرا در پس‌زمینه
docker-compose up -d

# متوقف کردن
docker-compose down
```

---

## 🌐 دسترسی به برنامه‌ها

بعد از اجرا، می‌توانید به آدرس‌های زیر دسترسی داشته باشید:

| سرویس | آدرس | توضیحات |
|--------|------|---------|
| 🖥️ **Backend API** | <http://localhost:5000> | API اصلی |
| 🌐 **Frontend** | <http://localhost:3000> | وب‌سایت مشتریان |
| 👨‍💼 **Admin Panel** | <http://localhost:3001> | پنل مدیریت |

---

## 📊 API Endpoints

### Products

- `GET /api/products` - لیست همه محصولات
- `GET /api/products/:id` - جزئیات یک محصول
- `POST /api/products` - ایجاد محصول جدید
- `PUT /api/products/:id` - ویرایش محصول
- `DELETE /api/products/:id` - حذف محصول

### Categories

- `GET /api/categories` - لیست دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی

### Orders

- `GET /api/orders` - لیست سفارشات
- `POST /api/orders` - ثبت سفارش جدید

### Health Check

- `GET /api/health` - بررسی وضعیت سرور

---

## 🔧 تنظیمات محیطی

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### Frontend & Admin (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄️ دیتابیس

این پروژه از **SQLite** با **Prisma ORM** استفاده می‌کند.

### مدل‌های دیتابیس

- **Product** - محصولات
- **Category** - دسته‌بندی‌ها
- **Order** - سفارشات
- **Admin** - کاربران مدیر

### دستورات مفید

```bash
# ایجاد migration جدید
npx prisma migrate dev --name migration_name

# اجرای seed
npm run prisma:seed

# باز کردن Prisma Studio (مشاهده دیتابیس)
npx prisma studio
```

---

## 🎯 ویژگی‌های اصلی

### Frontend (Next-App)

✅ صفحه اصلی با Hero Section  
✅ نمایش محصولات ویژه  
✅ دسته‌بندی محصولات  
✅ جزئیات محصول  
✅ سبد خرید  
✅ Dark Mode  

### Admin Panel

✅ داشبورد مدیریت  
✅ مدیریت کامل محصولات (CRUD)  
✅ مشاهده آمار  
✅ مدیریت سفارشات  

### Backend

✅ RESTful API  
✅ Prisma ORM  
✅ CORS برای چند origin  
✅ Error Handling  
✅ Request Logging  

---

## 🛠️ تکنولوژی‌های استفاده شده

### Backend

- Node.js 20
- Express.js
- Prisma ORM
- SQLite
- TypeScript
- CORS

### Frontend & Admin

- Next.js 15/16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
- Sonner (Toast)

---

## 📝 نکات مهم

1. **پورت‌ها**: مطمئن شوید پورت‌های 3000، 3001 و 5000 آزاد هستند
2. **Seed Data**: برای تست، حتماً داده‌های نمونه را با `npm run prisma:seed` ایجاد کنید
3. **Environment Variables**: فایل‌های `.env` و `.env.local` را بررسی کنید

---

## 🤝 مشارکت

برای مشارکت در این پروژه:

1. Fork کنید
2. یک branch جدید بسازید
3. تغییرات خود را commit کنید
4. Push کنید و Pull Request ایجاد کنید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 👨‍💻 نویسنده

ساخته شده با ❤️ برای یادگیری و توسعه

---

## 🐛 گزارش مشکلات

در صورت مواجهه با مشکل، لطفاً در Issues گزارش دهید.
