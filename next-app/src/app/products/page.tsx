import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import ProductsClient from "./products-client";

// Server-side data fetching
async function getProducts() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/products?limit=1000`, {
            next: { revalidate: 1800 }
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.products || data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getCategories() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/categories`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return [];

        const categories = await res.json();
        // Categories now come with subcategories as array of objects
        return categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subcategories: Array.isArray(cat.subcategories) 
                ? cat.subcategories 
                : (typeof cat.subcategories === 'string'
                    ? JSON.parse(cat.subcategories)
                    : [])
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export const metadata: Metadata = {
    title: "محصولات - فروشگاه بیوتی‌شاپ",
    description: "مشاهده و خرید محصولات آرایشی و بهداشتی با بهترین قیمت",
};

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
            <NavbarServer />
            <ProductsClient 
                initialProducts={products} 
                categories={categories}
            />
        </div>
    );
}
