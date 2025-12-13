#!/bin/bash

# Fix upload images - copy from container to host volume
echo "🔧 رفع مشکل عکس‌های آپلودی..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1️⃣ بررسی فایل‌های داخل کانتینر backend:"
docker exec shop-backend ls -lh /app/public/uploads/ 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣ کپی کردن تمام فایل‌ها از کانتینر به host:"

# Copy all files from container to host
docker cp shop-backend:/app/public/uploads/. /root/private-test-shop/uploads/

if [ $? -eq 0 ]; then
    echo "✅ فایل‌ها کپی شدند"
else
    echo "❌ خطا در کپی فایل‌ها"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣ بررسی فایل‌های جدید در host:"
ls -lh /root/private-test-shop/uploads/*.webp | tail -10

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣ تنظیم دسترسی‌ها:"
chmod -R 755 /root/private-test-shop/uploads
chown -R root:root /root/private-test-shop/uploads

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣ ریستارت docker برای fix کردن volume mapping:"
cd /root/private-test-shop
docker-compose -f docker-compose.prod.yml restart backend

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ تمام! الان عکس‌ها باید کار کنن."
echo ""
echo "🧪 تست کن: https://88shop.ir"
