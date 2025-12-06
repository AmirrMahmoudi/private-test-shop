import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const baseUrl = 'https://beautyshop.com'; // تغییر به دامنه واقعی

    try {
        // Fetch categories
        const categoriesRes = await fetch(`${API_URL}/api/categories`);
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];

        // Fetch products
        const productsRes = await fetch(`${API_URL}/api/products`);
        const products = productsRes.ok ? await productsRes.json() : [];

        // Static pages
        const routes = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1,
            },
            {
                url: `${baseUrl}/products`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/cart`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            },
            {
                url: `${baseUrl}/checkout`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            },
        ];

        // Category pages
        const categoryRoutes = categories.map((category: any) => ({
            url: `${baseUrl}/products/${category.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        // Product pages
        const productRoutes = (products.products || products).map((product: any) => ({
            url: `${baseUrl}/products/${product.slug || product.id}`,
            lastModified: new Date(product.updatedAt || product.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...routes, ...categoryRoutes, ...productRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
            },
        ];
    }
}
