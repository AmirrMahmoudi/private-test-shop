// API Base URL from environment variable
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
}

// Types
export interface Brand {
    id: string;
    name: string;
    nameEn?: string;
    logo?: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
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
    createdAt: string;
    updatedAt: string;
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
    brand?: {
        id: string;
        name: string;
        nameEn?: string;
        logo?: string;
    };
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

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    variantId?: string;
    variantName?: string;
    sku?: string;
    price: number;
    quantity: number;
    total: number;
    image?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    status: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    notes?: string;
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

// Generic fetch wrapper with auth
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = getAuthToken();

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetchAPI<any>('/products');
    // Handle both direct array and paginated response { products: [], pagination: {} }
    if (response.products && Array.isArray(response.products)) {
        return response.products;
    }
    if (Array.isArray(response)) {
        return response;
    }
    return [];
}

export async function fetchProductById(id: string): Promise<Product> {
    return fetchAPI<Product>(`/products/${id}`);
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return fetchAPI<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/products/${id}`, {
        method: 'DELETE',
    });
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
    const products = await fetchProducts();
    return products.filter(p => p.isFeatured);
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetchAPI<any>(`/products?category=${categoryId}`);
    if (response.products && Array.isArray(response.products)) {
        return response.products;
    }
    return [];
}

// ==================== Brands API ====================

export async function fetchBrands(): Promise<Brand[]> {
    return fetchAPI<Brand[]>('/brands');
}

export async function fetchBrandById(id: string): Promise<Brand> {
    return fetchAPI<Brand>(`/brands/${id}`);
}

export async function createBrand(brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    return fetchAPI<Brand>('/brands', {
        method: 'POST',
        body: JSON.stringify(brandData),
    });
}

export async function updateBrand(id: string, brandData: Partial<Brand>): Promise<Brand> {
    return fetchAPI<Brand>(`/brands/${id}`, {
        method: 'PUT',
        body: JSON.stringify(brandData),
    });
}

export async function deleteBrand(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/brands/${id}`, {
        method: 'DELETE',
    });
}

// ==================== Variants API ====================

export async function fetchVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    return fetchAPI<ProductVariant[]>(`/variants/product/${productId}`);
}

export async function fetchVariantById(id: string): Promise<ProductVariant> {
    return fetchAPI<ProductVariant>(`/variants/${id}`);
}

export async function createVariant(variantData: Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductVariant> {
    return fetchAPI<ProductVariant>('/variants', {
        method: 'POST',
        body: JSON.stringify(variantData),
    });
}

export async function updateVariant(id: string, variantData: Partial<ProductVariant>): Promise<ProductVariant> {
    return fetchAPI<ProductVariant>(`/variants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(variantData),
    });
}

export async function deleteVariant(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/variants/${id}`, {
        method: 'DELETE',
    });
}

// ==================== Categories API ====================

export async function fetchCategories(): Promise<Category[]> {
    return fetchAPI<Category[]>('/categories');
}

export async function fetchSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return fetchAPI<Subcategory[]>(`/categories/${categoryId}/subcategories`);
}

export async function createSubcategory(categoryId: string, subcategoryData: Omit<Subcategory, 'id' | 'categoryId' | 'createdAt'>): Promise<Subcategory> {
    return fetchAPI<Subcategory>(`/categories/${categoryId}/subcategories`, {
        method: 'POST',
        body: JSON.stringify(subcategoryData),
    });
}

export async function updateSubcategory(id: string, subcategoryData: Partial<Subcategory>): Promise<Subcategory> {
    return fetchAPI<Subcategory>(`/categories/subcategories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(subcategoryData),
    });
}

export async function deleteSubcategory(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/categories/subcategories/${id}`, {
        method: 'DELETE',
    });
}

export async function fetchCategoryById(id: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`);
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    return fetchAPI<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
    });
}

export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
    });
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/categories/${id}`, {
        method: 'DELETE',
    });
}

// ==================== Orders API ====================

export async function fetchOrders(): Promise<Order[]> {
    try {
        const response = await fetchAPI<any>('/orders');
        if (response.orders && Array.isArray(response.orders)) {
            return response.orders;
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
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

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    return fetchAPI<Order>(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
    });
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/orders/${id}`, {
        method: 'DELETE',
    });
}

// ==================== Hero API ====================

export async function fetchHero(): Promise<Hero> {
    return fetchAPI<Hero>('/hero');
}

export async function fetchHeroById(id: string): Promise<Hero> {
    return fetchAPI<Hero>(`/hero/${id}`);
}

export async function fetchAllHeroes(): Promise<Hero[]> {
    return fetchAPI<Hero[]>('/hero/all/list');
}

export async function createHero(heroData: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hero> {
    return fetchAPI<Hero>('/hero', {
        method: 'POST',
        body: JSON.stringify(heroData),
    });
}

export async function updateHero(id: string, heroData: Partial<Hero>): Promise<Hero> {
    return fetchAPI<Hero>(`/hero/${id}`, {
        method: 'PUT',
        body: JSON.stringify(heroData),
    });
}

export async function deleteHero(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/hero/${id}`, {
        method: 'DELETE',
    });
}

export async function fetchActiveHeroes(): Promise<Hero[]> {
    return fetchAPI<Hero[]>('/hero/slides');
}

// ==================== Upload API ====================

export async function uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${API_URL}/upload`;
    const token = getAuthToken();

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            // Don't set Content-Type header, let browser set it with boundary
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

// ==================== Festivals API ====================

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
    createdAt: string;
    updatedAt: string;
}

export async function fetchFestivals(): Promise<Festival[]> {
    return fetchAPI<Festival[]>('/festivals');
}

export async function fetchFestivalById(id: string): Promise<Festival> {
    return fetchAPI<Festival>(`/festivals/${id}`);
}

export async function createFestival(festivalData: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Promise<Festival> {
    return fetchAPI<Festival>('/festivals', {
        method: 'POST',
        body: JSON.stringify(festivalData),
    });
}

export async function updateFestival(id: string, festivalData: Partial<Festival>): Promise<Festival> {
    return fetchAPI<Festival>(`/festivals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(festivalData),
    });
}

export async function deleteFestival(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/festivals/${id}`, {
        method: 'DELETE',
    });
}
