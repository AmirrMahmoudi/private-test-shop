# راهنمای استقرار روی سرور (VPS Deployment Guide)

این راهنما برای دیپلوی کردن پروژه روی سرور لینوکسی (VPS) آماده شده است.

## پیش‌نیازها در سرور

1. **Git**: برای دریافت کد از گیت‌هاب.
2. **Docker** و **Docker Compose**: برای اجرای کانتینرها.

## مراحل استقرار

### ۱. اتصال به سرور و دانلود پروژه

وارد سرور شوید و پروژه را کلون کنید:

```bash
git clone https://github.com/AmirrMahmoudi/private-test-shop.git
cd private-test-shop
```

### ۲. تنظیمات محیطی (اختیاری)

اگر نیاز به دامین واقعی دارید، فایل `docker-compose.prod.yml` را ویرایش کنید و آدرس `NEXT_PUBLIC_API_URL` و `CORS_ORIGINS` را روی دامین خود تنظیم کنید.

### ۳. اجرای پروژه در حالت پروداکشن

برای بیلد و اجرا از دستور زیر استفاده کنید:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

- `-f docker-compose.prod.yml`: استفاده از فایل کانفیگ پروداکشن.
- `--build`: ساخت مجدد ایمیج‌ها.
- `-d`: اجرای در پس‌زمینه (Detach setup).

### ۴. ساخت دیتابیس در سرور (فقط بار اول)

چون در پروداکشن از فایل دیتابیس جدید `prod.db` استفاده می‌کنیم، باید یکبار مایگریشن‌ها را اجرا کنیم.
وارد کانتینر بک‌اند شوید:

```bash
docker exec -it shop-backend sh
```

سپس دستورات زیر را اجرا کنید:

```bash
# اجرای مایگریشن‌ها روی دیتابیس پروداکشن
npx prisma migrate deploy

# (اختیاری) اگر می‌خواهید دیتای اولیه اضافه شود
npm run prisma:seed
```

از کانتینر خارج شوید (`exit`).

### ۵. بررسی وضعیت

با دستور زیر وضعیت کانتینرها را ببینید:

```bash
docker-compose -f docker-compose.prod.yml ps
```

الان سایت شما باید روی پورت ۳۰۰۰ (مشتری) و ۳۰۰۱ (ادمین) سرور در دسترس باشد.

## آپدیت کردن پروژه

هر وقت تغییری در کد دادید و پوش کردید، در سرور این مراحل را طی کنید:

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml up --build -d
```
