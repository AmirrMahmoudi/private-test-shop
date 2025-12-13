#!/bin/bash

# Debug script for image upload issues
echo "🔍 بررسی مشکل آپلود عکس..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check uploads directory exists
echo ""
echo "1️⃣ بررسی فولدر uploads:"
if [ -d "/root/private-test-shop/uploads" ]; then
    echo "   ✅ فولدر موجود است"
    echo "   📁 تعداد فایل‌ها: $(find /root/private-test-shop/uploads -type f | wc -l)"
    echo ""
    echo "   📝 فایل‌های اخیر:"
    ls -lht /root/private-test-shop/uploads | head -10
else
    echo "   ❌ فولدر موجود نیست!"
    echo "   💡 ایجاد فولدر..."
    mkdir -p /root/private-test-shop/uploads/thumbnails
    chmod -R 755 /root/private-test-shop/uploads
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣ بررسی تنظیمات nginx:"
echo ""
echo "   📄 تنظیمات فعلی:"
grep -A 5 "location /uploads/" /etc/nginx/sites-available/shop.conf

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣ تست nginx:"
nginx -t

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣ بررسی دسترسی‌ها:"
ls -la /root/private-test-shop/ | grep uploads

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣ بررسی لاگ nginx:"
echo ""
echo "   آخرین خطاها:"
tail -20 /var/log/nginx/error.log | grep -i "uploads\|404"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ اطلاعات جمع‌آوری شد"
