import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CategoryClient from "./category-client";
import NavbarServer from "@/components/NavbarServer";

// Server-side data fetching
async function getCategoryData(categoryId: string) {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/categories`, {
            next: { revalidate: 0 }
        });

        if (!res.ok) return null;

        const categories = await res.json();
        return categories.find((cat: any) => cat.id === categoryId);
    } catch (error) {
        return null;
    }
}

async function getProductsByCategory(categoryId: string) {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/products?category=${categoryId}`, {
            next: { revalidate: 0 }
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.products || data; // Handle both paginated and non-paginated responses
    } catch (error) {
        return [];
    }
}

async function getAllCategories() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/categories`, {
            next: { revalidate: 0 }
        });

        if (!res.ok) return [];

        const categories = await res.json();
        return categories.map((cat: any) => ({
            ...cat,
            subcategories: typeof cat.subcategories === 'string'
                ? JSON.parse(cat.subcategories)
                : cat.subcategories
        }));
    } catch (error) {
        return [];
    }
}

async function getAllProducts() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/products?limit=1000`, {
            next: { revalidate: 0 }
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.products || data; // Handle both paginated and non-paginated responses
    } catch (error) {
        return [];
    }
}

// Generate static params for all categories
export async function generateStaticParams() {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/categories`);

        if (!res.ok) return [];

        const categories = await res.json();
        return categories.map((cat: any) => ({
            category: cat.id,
        }));
    } catch (error) {
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category: categoryParam } = await params;
    const category = await getCategoryData(categoryParam);

    if (!category) {
        return {
            title: "دسته‌بندی یافت نشد",
        };
    }

    return {
        title: `${category.name} - فروشگاه بیوتی‌شاپ`,
        description: `خرید محصولات ${category.name} با بهترین قیمت و کیفیت اصل`,
        openGraph: {
            title: `${category.name} - بیوتی‌شاپ`,
            description: `مشاهده و خرید محصولات ${category.name}`,
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categoryParam } = await params;

    // First check if it's a valid category
    const category = await getCategoryData(categoryParam);

    // If not a category, check if it's a product slug and redirect
    if (!category) {
        try {
            const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
            const productRes = await fetch(`${baseUrl}/products/${categoryParam}`, {
                next: { revalidate: 0 }
            });
            if (productRes.ok) {
                // It's a product, redirect to product page
                redirect(`/product/${categoryParam}`);
            }
        } catch (error) {
            // Ignore error and show not found
        }
        notFound();
    }

    const [products, allCategories, allProducts] = await Promise.all([
        getProductsByCategory(categoryParam),
        getAllCategories(),
        getAllProducts()
    ]);

    return (
        <>
            <NavbarServer />
            <CategoryClient
                category={category}
                products={products}
                allCategories={allCategories}
                allProducts={allProducts}
            />
        </>
    );
}
