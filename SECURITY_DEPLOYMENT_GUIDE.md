# 🔐 راهنمای کامل امنیت و Deployment

این فایل شامل تمام دستورات مورد نیاز برای اعمال تغییرات امنیتی و deployment در سرور است.

---

## 🚨 مرحله 1: رفع مشکل امنیتی JWT_SECRET

### الف) ساخت JWT Secret تصادفی در سرور

```bash
# اتصال به سرور
ssh your-server

# رفتن به پروژه
cd /root/private-test-shop

# ساخت یک JWT Secret قوی و تصادفی (64 کاراکتر hex)
openssl rand -hex 64
```

**خروجی مثال:**
```
a1b2c3d4e5f6789...کپی کنید!
```

### ب) ایجاد فایل .env.production

```bash
# ساخت فایل محیطی
nano .env.production
```

**محتوای فایل را کپی کنید:**
```bash
# فقط مقدار JWT_SECRET را با secret ساخته شده در بالا جایگزین کنید
JWT_SECRET=<paste-your-generated-secret-here>
DATABASE_URL=file:/app/data/prod.db
CORS_ORIGINS=https://88shop.ir,https://www.88shop.ir,https://admin.88shop.ir
NODE_ENV=production
PORT=5000
```

**ذخیره:** `Ctrl+O` → `Enter` → `Ctrl+X`

### ج) تأیید فایل

```bash
# بررسی که فایل ساخته شده
ls -la | grep .env

# نمایش محتوا (فقط برای تست - بعداً پاک کنید از تاریخچه)
cat .env.production
```

---

## 📥 مرحله 2: Pull کردن آخرین تغییرات از Git

```bash
# در پوشه پروژه
cd /root/private-test-shop

# Pull کردن تغییرات جدید
git pull origin main

# یا اگر branch دیگری دارید:
# git pull origin <branch-name>
```

---

## 🔄 مرحله 3: Rebuild و Restart کردن با .env جدید

```bash
# استفاده از .env.production برای docker-compose
docker-compose -f docker-compose.prod.yml --env-file .env.production down

# Rebuild و Start کردن
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d

# بررسی لاگ‌ها
docker logs shop-backend --tail=50
```

---

## 🗄️ مرحله 4: Migration و Seed (اگر دیتابیس خالی است)

```bash
# اجرای migration
docker exec -it shop-backend sh -c "npx prisma migrate deploy"

# اضافه کردن داده‌های اولیه
docker exec -it shop-backend sh -c "npm run prisma:seed"
```

---

## 🔑 مرحله 5: ریست کردن رمز ادمین

**اگر رمز ادمین یادتان رفته:**

```bash
# اجرای اسکریپت ریست رمز
docker exec -it shop-backend sh -c "npm run reset-password"
```

**خروجی:**
```
✅ رمز عبور با موفقیت تغییر کرد!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 ایمیل: admin@shop.com
🔑 رمز عبور جدید: admin123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🌐 مرحله 6: آپدیت Nginx (رفع مشکل عکس‌ها)

### الف) ویرایش فایل nginx

```bash
sudo nano /etc/nginx/sites-available/88shop.ir
```

### ب) پیدا کردن و **حذف** این بخش:

```nginx
# --- بخش حیاتی برای نمایش عکس‌ها ---
location /uploads/ {
    alias /root/private-test-shop/uploads/;
    access_log off;
    expires max;
    add_header Access-Control-Allow-Origin *;
}
# -----------------------------------
```

**حذف کامل کنید!** (بقیه فایل را نگه دارید)

### ج) تست و Reload

```bash
# تست syntax
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# یا اگر reload کار نکرد:
sudo systemctl restart nginx
```

---

## ✅ مرحله 7: تست نهایی

### 1. تست Login ادمین

```bash
# رفتن به https://admin.88shop.ir
# ورود با:
# Email: admin@shop.com
# Password: admin123
```

### 2. تست آپلود عکس

- افزودن محصول جدید با عکس
- بررسی نمایش عکس در لیست محصولات
- باز کردن DevTools (`F12`) → Network tab
- باید status `200 OK` باشد نه `404`

### 3. بررسی سایت اصلی

```bash
# باز کردن https://88shop.ir
# مشاهده محصولات
# بررسی نمایش عکس‌ها
```

---

## 🔍 عیب‌یابی (اگر مشکل داشت)

### اگر Backend اجرا نشد:

```bash
# بررسی لاگ‌ها
docker logs shop-backend -f

# بررسی متغیرهای محیطی
docker exec -it shop-backend sh -c "env | grep JWT"

# باید JWT_SECRET را نشان دهد (نه مقدار قدیمی)
```

### اگر Nginx خطا داد:

```bash
# بررسی لاگ خطا
sudo tail -f /var/log/nginx/error.log

# بررسی syntax
sudo nginx -t
```

### اگر هنوز عکس‌ها 404 می‌دهند:

```bash
# بررسی volume
docker inspect shop-backend | grep -A 10 Mounts

# بررسی فایل‌ها داخل container
docker exec -it shop-backend sh
ls -la /app/public/uploads/
exit

# Restart کردن
docker-compose -f docker-compose.prod.yml restart
```

---

## 📋 خلاصه دستورات (برای Copy-Paste سریع)

```bash
# 1. ساخت JWT Secret
cd /root/private-test-shop
openssl rand -hex 64

# 2. ساخت .env.production (پیست کردن secret)
nano .env.production
# محتوا را از بالا کپی کنید

# 3. Pull + Rebuild
git pull origin main
docker-compose -f docker-compose.prod.yml --env-file .env.production down
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d

# 4. Migration + Seed
docker exec -it shop-backend sh -c "npx prisma migrate deploy && npm run prisma:seed"

# 5. ریست رمز ادمین
docker exec -it shop-backend sh -c "npm run reset-password"

# 6. ویرایش nginx و حذف بخش /uploads/
sudo nano /etc/nginx/sites-available/88shop.ir
sudo nginx -t && sudo systemctl reload nginx

# 7. بررسی لاگ
docker logs shop-backend --tail=50
```

---

## ⚠️ نکات مهم امنیتی

### ✅ انجام دهید:
- فایل `.env.production` را **هرگز** commit نکنید
- JWT_SECRET را قوی و تصادفی بسازید (64+ کاراکتر)
- پس از deployment، رمز ادمین پیش‌فرض را تغییر دهید
- Repository را **Private** کنید در GitHub

### ❌ انجام ندهید:
- Secret‌ها را هیچ‌وقت hard-code نکنید
- از رمزهای ساده استفاده نکنید
- فایل `.env.production` را به کسی ندهید
- Secret‌های production را در development استفاده نکنید

---

## 📞 اطلاعات ورود پیش‌فرض

پس از seed:
- **Email:** `admin@shop.com`
- **Password:** `admin123`

⚠️ **حتماً بعد از اولین ورود رمز را تغییر دهید!**

---

✅ **تمام! اپ شما حالا ایمن و آماده است.** 🎉
