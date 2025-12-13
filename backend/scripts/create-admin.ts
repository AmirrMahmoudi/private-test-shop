import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createOrUpdateAdmin() {
    try {
        const adminEmail = 'admin@88shop.ir';
        const adminPassword = 'Admin@123!';
        const adminName = 'Admin';

        console.log('🔍 بررسی وجود کاربر ادمین...');

        const existingAdmin = await prisma.admin.findUnique({
            where: { email: adminEmail }
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        if (existingAdmin) {
            // بروزرسانی پسورد ادمین موجود
            await prisma.admin.update({
                where: { id: existingAdmin.id },
                data: {
                    password: hashedPassword,
                    isActive: true
                }
            });
            console.log('✅ پسورد ادمین موجود بروزرسانی شد!');
        } else {
            // ساخت ادمین جدید
            await prisma.admin.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: adminName,
                    role: 'super-admin',
                    isActive: true
                }
            });
            console.log('✅ ادمین جدید ساخته شد!');
        }

        console.log('\n' + '━'.repeat(50));
        console.log('📧 ایمیل: ' + adminEmail);
        console.log('🔑 پسورد: ' + adminPassword);
        console.log('━'.repeat(50));
        console.log('\n⚠️  این پسورد موقتی است. بعد از ورود آن را تغییر دهید.');

    } catch (error) {
        console.error('❌ خطا:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createOrUpdateAdmin();
