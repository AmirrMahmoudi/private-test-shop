export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavbarServer from "@/components/NavbarServer";
import ProductClient from "./product-client";

// Server-side data fetching
async function getProductBySlug(slug: string) {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/products/${slug}`, {
            next: { revalidate: 1800 }
        });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        return null;
    }
}

async function getCategoryData(categoryId: string) {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/categories`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const categories = await res.json();
        return categories.find((cat: any) => cat.id === categoryId);
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "محصول یافت نشد",
        };
    }

    return {
        title: `${product.name} - فروشگاه بیوتی‌شاپ`,
        description: product.description || `خرید ${product.name} با بهترین قیمت`,
        openGraph: {
            title: product.name,
            description: product.description || '',
            images: [product.image],
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Extract category ID whether it's an object or string
    const categoryId = typeof product.category === 'object' && product.category
        ? product.category.id
        : product.categoryId || product.category;

    const categoryData = typeof product.category === 'object' && product.category
        ? product.category
        : await getCategoryData(categoryId);

    return (
        <div className="min-h-screen bg-background font-sans">
            <NavbarServer />
            <ProductClient product={product} category={categoryData || { id: categoryId, name: 'دسته‌بندی', slug: '' }} />
        </div>
    );
}



