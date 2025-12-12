import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        // پیدا کردن کاربر ادمین
        const adminEmail = 'admin@shop.com';
        const newPassword = 'admin123'; // رمز عبور جدید

        console.log('🔍 جستجوی کاربر ادمین...');

        const admin = await prisma.admin.findUnique({
            where: { email: adminEmail }
        });

        if (!admin) {
            console.error('❌ کاربر ادمین یافت نشد!');
            console.log('💡 ایمیل مورد نظر:', adminEmail);

            // نمایش تمام کاربران موجود
            const allAdmins = await prisma.admin.findMany({
                select: { id: true, email: true, name: true, role: true }
            });

            console.log('\n📋 کاربران ادمین موجود در سیستم:');
            console.table(allAdmins);

            process.exit(1);
        }

        console.log('✅ کاربر پیدا شد:', admin.email);

        // هش کردن رمز عبور جدید
        console.log('🔐 هش کردن رمز عبور جدید...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // آپدیت رمز عبور
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword }
        });

        console.log('\n✅ رمز عبور با موفقیت تغییر کرد!');
        console.log('━'.repeat(50));
        console.log('📧 ایمیل:', adminEmail);
        console.log('🔑 رمز عبور جدید:', newPassword);
        console.log('━'.repeat(50));
        console.log('\n⚠️  توجه: این رمز عبور موقتی است. بعد از ورود حتماً آن را تغییر دهید.');

    } catch (error) {
        console.error('❌ خطا در ریست کردن رمز عبور:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
