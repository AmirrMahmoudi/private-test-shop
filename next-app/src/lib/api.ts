// API Base URL from environment variable
// API Base URL from environment variable
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface Brand {
    id: string;
    name: string;
    nameEn?: string;
    logo?: string;
    description?: string;
    isActive: boolean;
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    isActive: boolean;
    sortOrder: number;
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    sku: string;
    color?: string;
    colorCode?: string;
    size?: string;
    price: number;
    comparePrice?: number;
    stock: number;
    image?: string;
    isDefault: boolean;
    isActive: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    price: number;
    minPrice?: number;
    images: string[];
    image?: string;
    categoryId: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    subcategoryId?: string;
    subcategory?: {
        id: string;
        name: string;
        slug: string;
    };
    brandId?: string;
    brand?: Brand;
    stock: number;
    isFeatured: boolean;
    isActive: boolean;
    rating?: number;
    reviewCount: number;
    tags: string[];
    specifications?: Record<string, any>;
    variants?: ProductVariant[];
    variantsCount?: number;
    hasVariants?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    subcategories: Subcategory[];
    productsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    items: string; // JSON string
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Hero {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    button1Text?: string;
    button1Link?: string;
    button2Text?: string;
    button2Link?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// API Error type
export class APIError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            cache: 'no-store',
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new APIError(
                errorData?.error || `HTTP Error ${response.status}`,
                response.status,
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(
            error instanceof Error ? error.message : 'Network error',
            0
        );
    }
}

// ==================== Products API ====================

export async function fetchProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    brand?: string;
    tag?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}): Promise<{ products: Product[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.subcategory) searchParams.append('subcategory', params.subcategory);
    if (params?.brand) searchParams.append('brand', params.brand);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock) searchParams.append('inStock', 'true');

    const query = searchParams.toString();
    return fetchAPI<{ products: Product[]; pagination: any }>(`/products${query ? `?${query}` : ''}`);
}

export async function fetchProductById(idOrSlug: string): Promise<Product> {
    return fetchAPI<Product>(`/products/${idOrSlug}`);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
    const response = await fetchProducts({ featured: true, limit: 20 });
    return response.products;
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetchProducts({ category: categoryId });
    return response.products;
}

export async function fetchBrands(): Promise<Brand[]> {
    return fetchAPI<Brand[]>('/brands');
}

export async function fetchBrandById(id: string): Promise<Brand> {
    return fetchAPI<Brand>(`/brands/${id}`);
}

// ==================== Categories API ====================

export async function fetchCategories(): Promise<Category[]> {
    return fetchAPI<Category[]>('/categories');
}

export async function fetchCategoryById(id: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`);
}

export async function fetchSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return fetchAPI<Subcategory[]>(`/categories/${categoryId}/subcategories`);
}

export async function fetchVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    return fetchAPI<ProductVariant[]>(`/variants/product/${productId}`);
}

// ==================== Orders API ====================

export async function fetchOrders(): Promise<Order[]> {
    return fetchAPI<Order[]>('/orders');
}

export async function fetchOrderById(id: string): Promise<Order> {
    return fetchAPI<Order>(`/orders/${id}`);
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
    return fetchAPI<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

// ==================== Hero API ====================

export async function fetchHero(): Promise<Hero> {
    return fetchAPI<Hero>('/hero');
}

export async function fetchHeroSlides(): Promise<Hero[]> {
    try {
        const slides = await fetchAPI<Hero[]>('/hero/slides');
        // Ensure we always return an array, even if API fails or returns single object by mistake
        return Array.isArray(slides) ? slides : [];
    } catch (error) {
        console.error("Failed to fetch hero slides:", error);
        return [];
    }
}

// ==================== Festival API ====================

export interface Festival {
    id: string;
    title: string;
    description?: string;
    image: string;
    startDate?: string;
    endDate?: string;
    buttonText?: string;
    link?: string;
    isActive: boolean;
}

export async function fetchActiveFestival(): Promise<Festival | null> {
    try {
        return await fetchAPI<Festival>('/festivals/active');
    } catch (error) {
        console.error("Failed to fetch active festival:", error);
        return null;
    }
}
