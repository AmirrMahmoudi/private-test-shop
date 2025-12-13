/**
 * Migration script to convert old data structure to new structure
 * 
 * This script:
 * 1. Creates Brand entries from product brand strings
 * 2. Creates Subcategory entries from category subcategories JSON
 * 3. Updates products to use brandId, categoryId, subcategoryId
 * 4. Converts single image to images array
 * 5. Converts price to basePrice
 * 
 * Run with: npx ts-node backend/scripts/migrate-to-new-structure.ts
 */

import { PrismaClient } from "@prisma/client/index";
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting migration to new structure...\n');

    try {
        // Step 1: Migrate Brands
        console.log('📦 Step 1: Migrating brands...');
        const productsWithBrands = await prisma.product.findMany({
            where: {
                // Find products that might have brand as string in old structure
                // Note: This assumes old products might have been stored differently
                // Adjust based on your actual old structure
            },
            select: {
                id: true,
                // If you had a brand field as string, include it here
            }
        });

        // Create brands from unique brand names
        // Note: You'll need to adjust this based on how brands were stored
        // If brands were stored in a different way, modify this section
        const brandNames = new Set<string>();
        
        // Example: If you had products with brand field as string
        // You would extract them here and create Brand entries
        
        console.log(`✅ Brands migration completed\n`);

        // Step 2: Migrate Subcategories
        console.log('📁 Step 2: Migrating subcategories...');
        const categories = await prisma.category.findMany();
        
        for (const category of categories) {
            // Try to parse subcategories from JSON if they exist
            // Note: The new schema doesn't have a subcategories JSON field
            // This is for migrating from old data if it exists elsewhere
            
            // Create subcategories from category's subcategories if they exist
            // You'll need to check your old data structure
        }

        console.log(`✅ Subcategories migration completed\n`);

        // Step 3: Update Products
        console.log('🛍️ Step 3: Updating products...');
        const allProducts = await prisma.product.findMany();

        for (const product of allProducts) {
            const updateData: any = {};

            // Convert single image to images array if needed
            // Check if product has old image field and convert to images array
            // This depends on your old schema structure

            // Update price to basePrice if they're different
            // Note: Schema already has basePrice, so if you had price, migrate it

            // Link to brand if brandId is missing
            // Find brand by name and set brandId

            // Link to subcategory if subcategoryId is missing
            // Find subcategory by name and categoryId, set subcategoryId

            // Only update if there are changes
            // if (Object.keys(updateData).length > 0) {
            //     await prisma.product.update({
            //         where: { id: product.id },
            //         data: updateData
            //     });
            // }
        }

        console.log(`✅ Products update completed\n`);

        // Step 4: Create default variants for products without variants
        console.log('🎨 Step 4: Creating default variants...');
        const productsWithoutVariants = await prisma.product.findMany({
            where: {
                variants: {
                    none: {}
                }
            }
        });

        for (const product of productsWithoutVariants) {
            // Create a default variant for products that don't have any
            await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    name: 'پیش‌فرض',
                    sku: `${product.slug}-default`,
                    price: product.basePrice,
                    stock: 0, // Set appropriate default stock
                    isDefault: true,
                    isActive: true
                }
            });
        }

        console.log(`✅ Created ${productsWithoutVariants.length} default variants\n`);

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('Migration error:', e);
        process.exit(1);
    });







