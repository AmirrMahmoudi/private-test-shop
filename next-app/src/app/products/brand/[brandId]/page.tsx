import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import ProductsClient from "../../products-client";
import { fetchProducts, fetchCategories, fetchBrandById } from "@/lib/api";

// Server-side data fetching
async function getBrandProducts(brandId: string) {
    try {
        const data = await fetchProducts({ brand: brandId, limit: 1000 });
        return data.products || [];
    } catch (error) {
        console.error('Error fetching brand products:', error);
        return [];
    }
}

async function getCategories() {
    try {
        const categories = await fetchCategories();
        // Categories now come with subcategories as array of objects
        return categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subcategories: Array.isArray(cat.subcategories)
                ? cat.subcategories
                : (typeof cat.subcategories === 'string'
                    ? JSON.parse(cat.subcategories)
                    : []),
            isActive: cat.isActive ?? true,
            sortOrder: cat.sortOrder ?? 0,
            createdAt: cat.createdAt || new Date().toISOString(),
            updatedAt: cat.updatedAt || new Date().toISOString(),
            image: cat.image,
            description: cat.description
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function getBrandInfo(brandId: string) {
    try {
        return await fetchBrandById(brandId);
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ brandId: string }> }): Promise<Metadata> {
    const { brandId } = await params;
    const brand = await getBrandInfo(brandId);

    return {
        title: brand ? `محصولات برند ${brand.name} - فروشگاه بیوتی‌شاپ` : "محصولات برند - فروشگاه بیوتی‌شاپ",
        description: brand ? `خرید بهترین محصولات برند ${brand.name} با قیمت مناسب` : "مشاهده محصولات برند",
    };
}

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
    const { brandId } = await params;

    const [products, categories] = await Promise.all([
        getBrandProducts(brandId),
        getCategories()
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
            <NavbarServer />
            <ProductsClient
                initialProducts={products}
                categories={categories}
                brandId={brandId}
            />
        </div>
    );
}
