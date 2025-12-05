import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate slug
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FF\w-]/g, '')
        .substring(0, 50);
};

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.hero.deleteMany();

    console.log('🧹 Cleared existing data');

    // Create Brands
    console.log('📦 Creating brands...');
    const brands = await Promise.all([
        prisma.brand.create({ data: { id: "maybelline", name: "میبلین", nameEn: "Maybelline", isActive: true } }),
        prisma.brand.create({ data: { id: "mac", name: "مک", nameEn: "MAC", isActive: true } }),
        prisma.brand.create({ data: { id: "loreal", name: "لورآل", nameEn: "L'Oreal", isActive: true } }),
        prisma.brand.create({ data: { id: "urbandecay", name: "آربان دکی", nameEn: "Urban Decay", isActive: true } }),
        prisma.brand.create({ data: { id: "chanel", name: "شنل", nameEn: "Chanel", isActive: true } }),
        prisma.brand.create({ data: { id: "versace", name: "ورساچه", nameEn: "Versace", isActive: true } }),
        prisma.brand.create({ data: { id: "cerave", name: "سراوی", nameEn: "CeraVe", isActive: true } }),
        prisma.brand.create({ data: { id: "laroche", name: "لاروش پوزای", nameEn: "La Roche-Posay", isActive: true } }),
        prisma.brand.create({ data: { id: "ordinary", name: "اوردینری", nameEn: "The Ordinary", isActive: true } }),
        prisma.brand.create({ data: { id: "cosrx", name: "کوزارکس", nameEn: "COSRX", isActive: true } }),
        prisma.brand.create({ data: { id: "owen", name: "اوون", nameEn: "Owen", isActive: true } }),
        prisma.brand.create({ data: { id: "moroccanoil", name: "مورکانویل", nameEn: "Moroccanoil", isActive: true } }),
        prisma.brand.create({ data: { id: "pantene", name: "پنتن", nameEn: "Pantene", isActive: true } }),
        prisma.brand.create({ data: { id: "vichy", name: "ویچی", nameEn: "Vichy", isActive: true } }),
        prisma.brand.create({ data: { id: "kerastase", name: "کراستاز", nameEn: "Kérastase", isActive: true } }),
        prisma.brand.create({ data: { id: "tresemme", name: "ترزمه", nameEn: "TRESemmé", isActive: true } }),
        prisma.brand.create({ data: { id: "garnier", name: "گارنیه", nameEn: "Garnier", isActive: true } }),
        prisma.brand.create({ data: { id: "manicpanic", name: "منیک پنیک", nameEn: "Manic Panic", isActive: true } }),
        prisma.brand.create({ data: { id: "wella", name: "ویلا", nameEn: "Wella", isActive: true } }),
    ]);
    console.log(`✅ Created ${brands.length} brands`);

    // Create Categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                id: "cosmetics",
                name: "آرایشی",
                slug: "cosmetics",
                image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "perfume",
                name: "ادکلن",
                slug: "perfume",
                image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "skincare",
                name: "مراقبت پوست",
                slug: "skincare",
                image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "haircare",
                name: "مراقبت مو",
                slug: "haircare",
                image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "hairmask",
                name: "ماسک مو",
                slug: "hairmask",
                image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "shampoo",
                name: "شامپو",
                slug: "shampoo",
                image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800&auto=format&fit=crop",
            }
        }),
        prisma.category.create({
            data: {
                id: "haircolor",
                name: "رنگ مو",
                slug: "haircolor",
                image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop",
            }
        }),
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Subcategories
    console.log('📂 Creating subcategories...');
    const subcategoriesMap: Record<string, any> = {};
    
    // Cosmetics subcategories
    const cosmeticsSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "رژ لب", slug: "lipstick", categoryId: "cosmetics" } }),
        prisma.subcategory.create({ data: { name: "کرم پودر", slug: "foundation", categoryId: "cosmetics" } }),
        prisma.subcategory.create({ data: { name: "ریمل", slug: "mascara", categoryId: "cosmetics" } }),
        prisma.subcategory.create({ data: { name: "سایه چشم", slug: "eyeshadow", categoryId: "cosmetics" } }),
    ]);
    cosmeticsSubs.forEach(sub => {
        subcategoriesMap[`cosmetics-${sub.slug}`] = sub.id;
    });

    // Perfume subcategories
    const perfumeSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "زنانه", slug: "women", categoryId: "perfume" } }),
        prisma.subcategory.create({ data: { name: "مردانه", slug: "men", categoryId: "perfume" } }),
    ]);
    perfumeSubs.forEach(sub => {
        subcategoriesMap[`perfume-${sub.slug}`] = sub.id;
    });

    // Skincare subcategories
    const skincareSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "کرم مرطوب کننده", slug: "moisturizer", categoryId: "skincare" } }),
        prisma.subcategory.create({ data: { name: "ضد آفتاب", slug: "sunscreen", categoryId: "skincare" } }),
        prisma.subcategory.create({ data: { name: "سرم صورت", slug: "serum", categoryId: "skincare" } }),
        prisma.subcategory.create({ data: { name: "تونر", slug: "toner", categoryId: "skincare" } }),
    ]);
    skincareSubs.forEach(sub => {
        subcategoriesMap[`skincare-${sub.slug}`] = sub.id;
    });

    // Haircare subcategories
    const haircareSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "روغن مو", slug: "hair-oil", categoryId: "haircare" } }),
        prisma.subcategory.create({ data: { name: "سرم مو", slug: "hair-serum", categoryId: "haircare" } }),
        prisma.subcategory.create({ data: { name: "اسپری محافظ حرارت", slug: "heat-protectant", categoryId: "haircare" } }),
    ]);
    haircareSubs.forEach(sub => {
        subcategoriesMap[`haircare-${sub.slug}`] = sub.id;
    });

    // Hairmask subcategories
    const hairMaskSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "داخل حمام", slug: "in-shower", categoryId: "hairmask" } }),
        prisma.subcategory.create({ data: { name: "بیرون حمام", slug: "leave-in", categoryId: "hairmask" } }),
    ]);
    hairMaskSubs.forEach(sub => {
        subcategoriesMap[`hairmask-${sub.slug}`] = sub.id;
    });

    // Shampoo subcategories
    const shampooSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "بدون سولفات", slug: "sulfate-free", categoryId: "shampoo" } }),
        prisma.subcategory.create({ data: { name: "ضد ریزش", slug: "anti-hair-loss", categoryId: "shampoo" } }),
    ]);
    shampooSubs.forEach(sub => {
        subcategoriesMap[`shampoo-${sub.slug}`] = sub.id;
    });

    // Haircolor subcategories
    const hairColorSubs = await Promise.all([
        prisma.subcategory.create({ data: { name: "طبیعی", slug: "natural", categoryId: "haircolor" } }),
        prisma.subcategory.create({ data: { name: "فانتزی", slug: "fantasy", categoryId: "haircolor" } }),
        prisma.subcategory.create({ data: { name: "دکلره", slug: "bleach", categoryId: "haircolor" } }),
    ]);
    hairColorSubs.forEach(sub => {
        subcategoriesMap[`haircolor-${sub.slug}`] = sub.id;
    });

    console.log(`✅ Created subcategories`);

    // Create Hero
    console.log('📝 Creating hero...');
    await prisma.hero.create({
        data: {
            title: 'زیبایی طبیعی خود را با محصولات ما کشف کنید',
            subtitle: 'مجموعه‌ای از بهترین لوازم آرایشی، مراقبت پوست و مو برای درخشش شما. کیفیت اصیل، قیمت مناسب.',
            image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop',
            button1Text: 'خرید کنید',
            button1Link: '/products',
            button2Text: 'مراقبت پوست',
            button2Link: '/products/skincare',
            isActive: true
        }
    });
    console.log('✅ Created hero');

    // Create Products
    console.log('🛍️ Creating products...');
    const products = await Promise.all([
        // آرایشی
        prisma.product.create({
            data: {
                name: "رژ لب مات مخملی",
                slug: "rozh-lab-mat-makhmal",
                categoryId: "cosmetics",
                subcategoryId: subcategoriesMap["cosmetics-lipstick"],
                brandId: "maybelline",
                basePrice: 450000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop"]),
                description: "رژ لب با ماندگاری بالا و بافت مخملی، مناسب برای استفاده روزانه و مهمانی",
                isFeatured: true,
                rating: 4.8,
                tags: JSON.stringify(["مات", "ماندگار"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "کرم پودر فول کاور",
                slug: "cream-powder-full-cover",
                categoryId: "cosmetics",
                subcategoryId: subcategoriesMap["cosmetics-foundation"],
                brandId: "mac",
                basePrice: 680000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1631730486784-5456119f69ae?q=80&w=800&auto=format&fit=crop"]),
                description: "پوشانندگی بالا با بافت سبک و طبیعی",
                isFeatured: true,
                rating: 4.9,
                tags: JSON.stringify(["فول کاور", "سبک"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "ریمل حجم‌دهنده",
                slug: "rimel-hajm-dahande",
                categoryId: "cosmetics",
                subcategoryId: subcategoriesMap["cosmetics-mascara"],
                brandId: "loreal",
                basePrice: 320000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=800&auto=format&fit=crop"]),
                description: "ریمل با فرمول ویژه برای حجم و بلندی مژه‌ها",
                isFeatured: false,
                rating: 4.6,
                tags: JSON.stringify(["حجم‌دهنده", "ضدآب"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "پالت سایه چشم ۱۲ رنگ",
                slug: "eyeshadow-palette-12-colors",
                categoryId: "cosmetics",
                subcategoryId: subcategoriesMap["cosmetics-eyeshadow"],
                brandId: "urbandecay",
                basePrice: 890000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop"]),
                description: "پالت کامل با رنگ‌های متنوع مات و شاین",
                isFeatured: true,
                rating: 4.7,
                tags: JSON.stringify(["پالت", "۱۲ رنگ"]),
            }
        }),

        // ادکلن
        prisma.product.create({
            data: {
                name: "ادکلن شنل چنس",
                slug: "chanel-chance-perfume",
                categoryId: "perfume",
                subcategoryId: subcategoriesMap["perfume-women"],
                brandId: "chanel",
                basePrice: 5500000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"]),
                description: "عطری ملایم و شیرین مناسب تمام فصول",
                isFeatured: true,
                rating: 4.9,
                tags: JSON.stringify(["اورجینال", "زنانه"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "ادکلن بلو دو شنل",
                slug: "chanel-bleu-perfume",
                categoryId: "perfume",
                subcategoryId: subcategoriesMap["perfume-men"],
                brandId: "chanel",
                basePrice: 6200000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop"]),
                description: "عطری خنک و تند مناسب آقایان",
                isFeatured: true,
                rating: 4.8,
                tags: JSON.stringify(["اورجینال", "مردانه"]),
            }
        }),

        // مراقبت پوست
        prisma.product.create({
            data: {
                name: "کرم آبرسان قوی",
                slug: "moisturizer-cream-strong",
                categoryId: "skincare",
                subcategoryId: subcategoriesMap["skincare-moisturizer"],
                brandId: "cerave",
                basePrice: 280000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"]),
                description: "آبرسانی ۲۴ ساعته مناسب پوست‌های خشک",
                isFeatured: true,
                rating: 4.8,
                tags: JSON.stringify(["آبرسان", "پوست خشک"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "ضد آفتاب SPF50",
                slug: "sunscreen-spf50",
                categoryId: "skincare",
                subcategoryId: subcategoriesMap["skincare-sunscreen"],
                brandId: "laroche",
                basePrice: 420000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=800&auto=format&fit=crop"]),
                description: "محافظت کامل در برابر اشعه UV با بافت سبک",
                isFeatured: true,
                rating: 4.9,
                tags: JSON.stringify(["SPF50", "سبک"]),
            }
        }),

        // ماسک مو
        prisma.product.create({
            data: {
                name: "ماسک مو کراتینه داخل حمام",
                slug: "keratin-hair-mask-shower",
                categoryId: "hairmask",
                subcategoryId: subcategoriesMap["hairmask-in-shower"],
                brandId: "loreal",
                basePrice: 320000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800&auto=format&fit=crop"]),
                description: "ترمیم کننده موهای آسیب دیده - استفاده داخل حمام",
                isFeatured: true,
                rating: 4.8,
                tags: JSON.stringify(["کراتینه", "داخل حمام", "ترمیم"]),
            }
        }),
        prisma.product.create({
            data: {
                name: "ماسک مو بدون آبکشی",
                slug: "leave-in-hair-mask",
                categoryId: "hairmask",
                subcategoryId: subcategoriesMap["hairmask-leave-in"],
                brandId: "pantene",
                basePrice: 290000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1519735777090-ec97162dc266?q=80&w=800&auto=format&fit=crop"]),
                description: "ماسک موی سریع بدون نیاز به آبکشی",
                isFeatured: true,
                rating: 4.6,
                tags: JSON.stringify(["بدون آبکشی", "بیرون حمام"]),
            }
        }),

        // شامپو
        prisma.product.create({
            data: {
                name: "شامپو بدون سولفات موهای رنگ شده",
                slug: "sulfate-free-shampoo-colored",
                categoryId: "shampoo",
                subcategoryId: subcategoriesMap["shampoo-sulfate-free"],
                brandId: "loreal",
                basePrice: 190000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop"]),
                description: "محافظت از رنگ مو و فاقد سولفات",
                isFeatured: true,
                rating: 4.8,
                tags: JSON.stringify(["بدون سولفات", "موی رنگ شده"]),
            }
        }),

        // مراقبت مو
        prisma.product.create({
            data: {
                name: "روغن آرگان خالص",
                slug: "pure-argan-oil",
                categoryId: "haircare",
                subcategoryId: subcategoriesMap["haircare-hair-oil"],
                brandId: "moroccanoil",
                basePrice: 550000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop"]),
                description: "روغن آرگان ۱۰۰٪ خالص و ارگانیک",
                isFeatured: true,
                rating: 4.9,
                tags: JSON.stringify(["آرگان", "ارگانیک"]),
            }
        }),

        // رنگ مو
        prisma.product.create({
            data: {
                name: "رنگ موی قهوه‌ای شکلاتی",
                slug: "chocolate-brown-hair-color",
                categoryId: "haircolor",
                subcategoryId: subcategoriesMap["haircolor-natural"],
                brandId: "garnier",
                basePrice: 180000,
                images: JSON.stringify(["https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop"]),
                description: "رنگ موی بدون آمونیاک با پوشش کامل سفیدی",
                isFeatured: true,
                rating: 4.7,
                tags: JSON.stringify(["بدون آمونیاک", "طبیعی"]),
            }
        }),
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Create default variants for products
    console.log('🎨 Creating variants...');
    for (const product of products) {
        await prisma.productVariant.create({
            data: {
                productId: product.id,
                name: "پیش‌فرض",
                sku: `${product.slug}-default`,
                price: product.basePrice,
                stock: Math.floor(Math.random() * 50) + 10,
                isDefault: true,
                isActive: true
            }
        });
    }
    console.log(`✅ Created variants for products`);

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
