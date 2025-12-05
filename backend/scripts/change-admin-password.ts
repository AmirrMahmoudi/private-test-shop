import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log('🔒 Admin Management Script');
    console.log('--------------------------------');

    try {
        const email = await question('Enter admin email (default: admin@beauty.shop): ') || 'admin@beauty.shop';

        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            console.log(`⚠️  Admin with email "${email}" not found.`);
            const create = await question('Do you want to create a new admin with this email? (y/n): ');

            if (create.toLowerCase() === 'y') {
                const name = await question('Enter admin name: ');
                const password = await question('Enter new password: ');
                if (!password || password.length < 6) {
                    console.error('❌ Password must be at least 6 characters.');
                    process.exit(1);
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                await prisma.admin.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        role: 'super-admin',
                        isActive: true
                    }
                });
                console.log(`✅ New admin "${email}" created successfully!`);
            } else {
                console.log('❌ Operation cancelled.');
            }
        } else {
            console.log(`✅ Found admin: ${admin.name} (${admin.email})`);
            const newPassword = await question('Enter new password: ');
            if (!newPassword || newPassword.length < 6) {
                console.error('❌ Password must be at least 6 characters.');
                process.exit(1);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.admin.update({
                where: { email },
                data: { password: hashedPassword }
            });

            console.log('✅ Password updated successfully!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

main();
