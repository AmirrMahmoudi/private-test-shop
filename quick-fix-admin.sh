#!/bin/bash

# Quick fix: Create admin directly in container
# Usage: bash quick-fix-admin.sh

echo "🔧 ساخت سریع ادمین در دیتابیس..."

docker exec -i shop-backend node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@88shop.ir';
    const password = 'Admin@123!';
    
    console.log('🔍 بررسی ادمین موجود...');
    
    const existing = await prisma.admin.findUnique({
      where: { email }
    });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (existing) {
      await prisma.admin.update({
        where: { id: existing.id },
        data: { password: hashedPassword, isActive: true }
      });
      console.log('✅ پسورد ادمین بروز شد!');
    } else {
      await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Admin',
          role: 'super-admin',
          isActive: true
        }
      });
      console.log('✅ ادمین جدید ساخته شد!');
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ایمیل: ' + email);
    console.log('🔑 پسورد: ' + password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await prisma.\$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
}

createAdmin();
"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ تمام! الان میتونی وارد بشی:"
  echo "🌐 https://admin.88shop.ir"
else
  echo ""
  echo "❌ خطا در ساخت ادمین"
  echo "💡 لاگ کانتینر رو بررسی کن:"
  echo "   docker logs shop-backend --tail 50"
fi
