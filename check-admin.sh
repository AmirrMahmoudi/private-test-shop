#!/bin/bash

# Script to check and fix admin login issues on VPS
# Run this on VPS: bash check-admin.sh

echo "🔍 بررسی وضعیت دیتابیس و ادمین..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if database file exists
if [ -f "/root/private-test-shop/backend-data/prod.db" ]; then
    echo "✅ فایل دیتابیس موجود است"
    DB_SIZE=$(du -h /root/private-test-shop/backend-data/prod.db | cut -f1)
    echo "📊 حجم دیتابیس: $DB_SIZE"
else
    echo "❌ فایل دیتابیس موجود نیست!"
    echo "💡 ایجاد فایل دیتابیس خالی..."
    mkdir -p /root/private-test-shop/backend-data
    touch /root/private-test-shop/backend-data/prod.db
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 اجرای اسکریپت ساخت ادمین..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run create-admin script inside backend container
docker exec -it shop-backend sh -c "cd /app && npx tsx scripts/create-admin.ts"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ تمام!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "اطلاعات ورود:"
echo "📧 ایمیل: admin@88shop.ir"
echo "🔑 پسورد: Admin@123!"
echo ""
echo "تست کن: https://admin.88shop.ir"
