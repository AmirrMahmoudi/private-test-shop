# راهنمای Backend فروشگاه 🚀

این پروژه Backend با استفاده از **Node.js**, **Express**, **TypeScript** و **Prisma** (برای دیتابیس) ساخته شده است.

## 1️⃣ نحوه اجرا (Run)

برای اجرای سرور، ترمینال را در پوشه `backend` باز کنید و دستور زیر را بزنید:

```bash
npm run dev
```

✅ سرور روی آدرس `http://localhost:5000` اجرا می‌شود.
✅ اگر پیام `🚀 Server running...` را دیدید، یعنی همه چیز درست است!

---

## 2️⃣ ساختار فایل‌ها (File Structure)

```
backend/
├── src/
│   ├── index.ts          # نقطه شروع برنامه (تنظیمات سرور)
│   ├── db.ts             # اتصال به دیتابیس (Prisma Client)
│   └── routes/           # مسیرهای API (آدرس‌ها)
│       ├── products.ts   # مدیریت محصولات (GET, POST, ...)
│       ├── orders.ts     # مدیریت سفارشات
│       └── categories.ts # مدیریت دسته‌بندی‌ها
├── prisma/
│   ├── schema.prisma     # تعریف جدول‌های دیتابیس (Models)
│   └── dev.db            # فایل دیتابیس (SQLite)
├── .env                  # تنظیمات محرمانه (Port, Database URL)
└── package.json          # لیست کتابخانه‌های نصب شده
```

---

## 3️⃣ لیست API ها (Endpoints)

این‌ها آدرس‌هایی هستند که فرانت‌اند می‌تواند به آن‌ها درخواست بفرستد:

### محصولات (Products)

- **دریافت همه:** `GET /api/products`
- **دریافت تکی:** `GET /api/products/:id`
- **ایجاد:** `POST /api/products`
- **آپدیت:** `PUT /api/products/:id`
- **حذف:** `DELETE /api/products/:id`

### سفارشات (Orders)

- **دریافت همه:** `GET /api/orders`
- **ثبت سفارش:** `POST /api/orders`

### وضعیت سرور

- **چک کردن:** `GET /api/health`

---

## 4️⃣ چطور به Frontend وصل کنیم؟ 🤔

در پروژه Next.js (فرانت‌اند)، می‌توانید با `fetch` به این API ها وصل شوید.

### مثال: دریافت لیست محصولات

```typescript
// در فایل src/lib/api.ts یا مستقیم در کامپوننت

const API_URL = "http://localhost:5000/api";

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: "no-store" // برای دریافت همیشه دیتای تازه
    });
    
    if (!res.ok) throw new Error("Failed to fetch products");
    
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
```

### مثال: ثبت سفارش (ارسال دیتا)

```typescript
export async function createOrder(orderData: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  return res.json();
}
```

---

## 🛠 ابزارهای مفید

- **Prisma Studio:** یک پنل گرافیکی برای دیدن و ویرایش دیتابیس
  - دستور: `npx prisma studio`
- **Postman:** برنامه‌ای برای تست کردن API ها قبل از کدنویسی در فرانت‌اند
