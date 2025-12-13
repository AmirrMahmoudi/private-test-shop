#!/bin/bash

# Complete diagnostic and fix for upload issues
echo "🔍 تشخیص کامل مشکل عکس‌ها..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📌 مرحله 1: بررسی فایل‌های داخل کانتینر backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker exec shop-backend ls -lh /app/public/uploads/ | grep -E "\.webp|\.jpg|\.png" || echo "❌ هیچ فایلی در کانتینر نیست"

echo ""
echo "📌 مرحله 2: بررسی فایل‌های در host"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ls -lh /root/private-test-shop/uploads/*.webp 2>/dev/null || echo "❌ هیچ فایل webp در host نیست"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 آیا باید فایل‌ها رو کپی کنیم از کانتینر؟ (y/n)"
read -p "> " answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo ""
    echo "📌 مرحله 3: کپی کردن فایل‌ها از کانتینر"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create uploads directory if doesn't exist
    mkdir -p /root/private-test-shop/uploads/thumbnails
    
    # Copy files
    docker cp shop-backend:/app/public/uploads/. /root/private-test-shop/uploads/
    
    # Set permissions
    chmod -R 755 /root/private-test-shop/uploads
    chown -R www-data:www-data /root/private-test-shop/uploads
    
    echo "✅ فایل‌ها کپی شدند"
    
    echo ""
    echo "📌 مرحله 4: نمایش فایل‌های جدید"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    ls -lh /root/private-test-shop/uploads/*.webp 2>/dev/null | head -20
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 تست نهایی: امتحان یک URL مستقیم"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find one webp file
SAMPLE_FILE=$(ls /root/private-test-shop/uploads/*.webp 2>/dev/null | head -1 | xargs basename)

if [ ! -z "$SAMPLE_FILE" ]; then
    echo "✅ فایل نمونه: $SAMPLE_FILE"
    echo ""
    echo "🌐 تست کن این URL رو در مرورگر:"
    echo "   https://api.88shop.ir/uploads/$SAMPLE_FILE"
    echo ""
    echo "   یا با curl:"
    curl -I "https://api.88shop.ir/uploads/$SAMPLE_FILE" 2>/dev/null | head -5
else
    echo "❌ هیچ فایلی برای تست یافت نشد"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ تمام!"
