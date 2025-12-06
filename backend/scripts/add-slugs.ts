import { PrismaClient } from "@prisma/client/index";import { createProductSlug } from '../src/utils/slug';

const prisma = new PrismaClient();

async function addSlugsToProducts() {
    console.log('Starting to add slugs to products...');
    
    const products = await prisma.product.findMany({
        where: {
            slug: null
        }
    });

    console.log(`Found ${products.length} products without slugs`);

    for (const product of products) {
        const slug = createProductSlug(product.name, product.id);
        
        // Ensure unique slug
        let finalSlug = slug;
        let counter = 1;
        while (await prisma.product.findFirst({ 
            where: { 
                slug: finalSlug,
                NOT: { id: product.id }
            } 
        })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        await prisma.product.update({
            where: { id: product.id },
            data: { slug: finalSlug }
        });

        console.log(`Updated product ${product.name} with slug: ${finalSlug}`);
    }

    console.log('Finished adding slugs to products');
}

addSlugsToProducts()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });



