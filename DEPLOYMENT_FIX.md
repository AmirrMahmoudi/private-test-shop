# راهنمای رفع مشکلات Deployment

این راهنما برای حل دو مشکل اصلی در سرور شما آماده شده:
1. ✅ پاک شدن داده‌ها
2. ✅ خطای 404 برای عکس‌ها

---

## مرحله 1️⃣: آپدیت تنظیمات Nginx در سرور

### گام الف: ویرایش فایل nginx

```bash
# ویرایش فایل تنظیمات nginx
sudo nano /etc/nginx/sites-available/88shop.ir
```

یا اگر نام فایل متفاوت است:
```bash
# لیست کردن فایل‌های موجود
ls -la /etc/nginx/sites-available/
```

### گام ب: حذف بخش `/uploads/`

**قبل از تغییر** فایل شما چنین بخشی دارد:
```nginx
server {
    listen 80;
    server_name api.88shop.ir;

    # --- بخش حیاتی برای نمایش عکس‌ها ---
    location /uploads/ {
        alias /root/private-test-shop/uploads/;
        access_log off;
        expires max;
        add_header Access-Control-Allow-Origin *;
    }
    # -----------------------------------

    location / {
        proxy_pass http://localhost:5000;
        ...
    }
}
```

**بعد از تغییر** باید شبیه این شود:
```nginx
server {
    listen 80;
    server_name api.88shop.ir;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        client_max_body_size 10M;
    }
}
```

یعنی **کل بخش** `location /uploads/` و کامنت‌های اطراف آن را پاک کنید.

### گام ج: تست و Reload کردن Nginx

```bash
# تست کردن تنظیمات nginx (باید بگوید syntax is ok)
sudo nginx -t

# اگر همه چیز OK بود، reload کنید
sudo systemctl reload nginx

# یا اگر reload کار نکرد:
sudo systemctl restart nginx
```

---

## مرحله 2️⃣: بازگردانی داده‌های دیتابیس

### گام الف: اجرای Migration

```bash
# رفتن به پوشه پروژه
cd /root/private-test-shop

# اجرای migration برای ساخت جداول
docker exec -it shop-backend sh -c "npx prisma migrate deploy"
```

### گام ب: اضافه کردن داده‌های اولیه (Seed)

```bash
# اجرای seed برای ایجاد داده‌های تست
docker exec -it shop-backend sh -c "npm run prisma:seed"
```

این دستور داده‌های زیر را ایجاد می‌کند:
- کاربر ادمین پیش‌فرض
- دسته‌بندی‌های اولیه
- چند محصول نمونه

**اطلاعات ورود به ادمین:**
- ایمیل: `admin@shop.com`
- رمز عبور: `admin123`

---

## مرحله 3️⃣: تست و بررسی

### 1. بررسی لاگ‌ها

```bash
# مشاهده لاگ‌های backend
docker logs shop-backend --tail=50

# مشاهده لاگ‌های live
docker logs shop-backend -f
```

### 2. تست آپلود عکس

1. رفتن به `https://admin.88shop.ir`
2. ورود با اطلاعات ادمین
3. رفتن به بخش محصولات
4. اضافه کردن محصول جدید با عکس
5. ذخیره و بررسی نمایش عکس در لیست

### 3. بررسی Network در مرورگر

در صفحه محصولات:
1. باز کردن Developer Tools (`F12`)
2. رفتن به تب **Network**
3. Refresh کردن صفحه
4. بررسی request‌های `/uploads/...` 
5. باید **200 OK** باشند، نه **404**

---

## چرا این کار جواب می‌دهد؟

### مشکل قبلی:
- Nginx می‌خواست فایل‌ها را از `/root/private-test-shop/uploads/` serve کند
- اما Docker volume داخل container است و nginx خارج از container به آن دسترسی نداشت
- در نتیجه همیشه 404 برمی‌گشت

### راه‌حل:
- حالا تمام request‌های `/uploads/` به backend (Node.js) فرستاده می‌شوند
- Backend از طریق `express.static` مستقیماً از Docker volume serve می‌کند
- چون backend داخل همان container است، به volume دسترسی کامل دارد

---

## عیب‌یابی (Troubleshooting)

### اگر هنوز عکس‌ها 404 می‌دهند:

```bash
# 1. بررسی کردن که volume به درستی mount شده
docker inspect shop-backend | grep -A 10 Mounts

# 2. بررسی فایل‌ها داخل container
docker exec -it shop-backend sh
ls -la /app/public/uploads/
exit

# 3. Restart کردن containers
docker-compose -f docker-compose.prod.yml restart
```

### اگر دیتابیس خالی ماند:

```bash
# بررسی فایل دیتابیس
docker exec -it shop-backend sh
ls -la /app/data/
# باید prod.db را ببینید

# اجرای دوباره seed
npm run prisma:seed
exit
```

### اگر nginx خطا داد:

```bash
# بررسی لاگ‌های nginx
sudo tail -f /var/log/nginx/error.log

# یا
sudo journalctl -u nginx -f
```

---

## خلاصه دستورات (برای اجرای سریع)

```bash
# 1. ویرایش nginx و حذف بخش /uploads/
sudo nano /etc/nginx/sites-available/88shop.ir

# 2. تست و reload
sudo nginx -t && sudo systemctl reload nginx

# 3. رفتن به پروژه
cd /root/private-test-shop

# 4. Migration + Seed
docker exec -it shop-backend sh -c "npx prisma migrate deploy && npm run prisma:seed"

# 5. بررسی لاگ
docker logs shop-backend --tail=50
```

✅ پس از انجام این مراحل، سایت شما باید کاملاً کار کند!
