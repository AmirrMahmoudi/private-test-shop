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
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://88shop.ir';

                const staticRoutes = [
                    '',
                    '/about',
                    '/contact',
                    '/products',
                    '/login',
                    '/register',
                ].map((route) => ({
                    url: `${baseUrl}${route}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily' as const,
                    priority: route === '' ? 1 : 0.8,
                }));

                try {
                    const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                    const apiBaseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

                    // Add timeout to fetch to fail fast during build
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(`${apiBaseUrl}/products?limit=1000`, {
                        signal: controller.signal,
                        next: { revalidate: 3600 }
                    });

                    clearTimeout(timeoutId);

    if(!response.ok) {
                throw new Error('Failed to fetch products');
            }

    const data = await response.json();
        const products = data.products || [];

        const productRoutes = products.map((product: any) => ({
            url: `${baseUrl}/product/${product.slug || product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...productRoutes];
    } catch (error) {
        console.warn('Failed to generate dynamic sitemap, returning static only:', error);
        return staticRoutes;
    }
}
