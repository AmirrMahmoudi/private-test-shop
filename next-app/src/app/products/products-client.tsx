"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutGrid } from "lucide-react";
import ProductsFilters from "./products-filters";
import ProductsGrid from "./products-grid";
import type { Product, Category, Brand } from "@/lib/api";
import { fetchBrands } from "@/lib/api";

interface ProductsClientProps {
    initialProducts: Product[];
    categories: Category[];
    brandId?: string;
    categoryId?: string;
}

export default function ProductsClient({ initialProducts, categories, brandId, categoryId }: ProductsClientProps) {
    const pathname = usePathname();
    const [brands, setBrands] = useState<Brand[]>([]);

    // Use passed categoryId or extract from URL (fallback)
    const currentCategoryId = categoryId || (pathname.startsWith('/products/') && pathname !== '/products' && !pathname.includes('/brand/')
        ? pathname.split('/products/')[1]?.split('/')[0]
        : null);

    // Load brands
    useEffect(() => {
        fetchBrands().then(setBrands).catch(console.error);
    }, []);

    // Filter states
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>(brandId ? [brandId] : []);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [gridCols, setGridCols] = useState<3 | 4>(3);

    // Extract all available tags from products
    const availableTags = useMemo(() => {
        const tagSet = new Set<string>();
        initialProducts.forEach(product => {
            if (product.tags && Array.isArray(product.tags)) {
                product.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }, [initialProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter((product) => {
            // Category filter (from URL)
            if (currentCategoryId && product.categoryId !== currentCategoryId) {
                return false;
            }

            // Subcategory filter
            const matchesSubcategory =
                selectedSubcategories.length === 0 ||
                (product.subcategoryId && selectedSubcategories.includes(product.subcategoryId)) ||
                (product.subcategory && selectedSubcategories.includes(product.subcategory.id));

            // Brand filter
            const matchesBrand =
                selectedBrands.length === 0 ||
                (product.brandId && selectedBrands.includes(product.brandId)) ||
                (product.brand && selectedBrands.includes(product.brand.id));

            // Tag filter
            const matchesTag =
                selectedTags.length === 0 ||
                (product.tags && Array.isArray(product.tags) &&
                    selectedTags.some(tag => product.tags!.includes(tag)));

            // Search filter
            const productTags = Array.isArray(product.tags) ? product.tags : [];
            const brandName = typeof product.brand === 'string'
                ? product.brand
                : product.brand?.name || '';
            const subcategoryName = typeof product.subcategory === 'string'
                ? product.subcategory
                : product.subcategory?.name || '';

            const matchesSearch =
                searchQuery === "" ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                subcategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                productTags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesSubcategory && matchesBrand && matchesTag && matchesSearch;
        });

        // Sort products
        switch (sortBy) {
            case "price-low":
                result = [...result].sort((a, b) => (a.minPrice || a.price) - (b.minPrice || b.price));
                break;
            case "price-high":
                result = [...result].sort((a, b) => (b.minPrice || b.price) - (a.minPrice || a.price));
                break;
            case "rating":
                result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                // newest - keep original order
                break;
        }

        return result;
    }, [initialProducts, currentCategoryId, selectedSubcategories, selectedBrands, selectedTags, searchQuery, sortBy]);

    const handleFiltersChange = (filters: {
        selectedSubcategories: string[];
        selectedBrands: string[];
        selectedTags: string[];
        searchQuery: string;
        sortBy: string;
    }) => {
        setSelectedSubcategories(filters.selectedSubcategories);
        setSelectedBrands(filters.selectedBrands);
        setSelectedTags(filters.selectedTags);
        setSearchQuery(filters.searchQuery);
        setSortBy(filters.sortBy);
    };

    const currentCategory = currentCategoryId
        ? categories.find(c => c.id === currentCategoryId)
        : null;

    return (
        <main className="container mx-auto px-4 py-8 md:py-12">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            {currentCategory?.name || 'همه محصولات'}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {filteredProducts.length} محصول از {initialProducts.length} محصول
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Grid Toggle - Desktop */}
                        <div className="hidden lg:flex items-center border rounded-lg p-1 bg-background">
                            <Button
                                variant={gridCols === 3 ? "secondary" : "ghost"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setGridCols(3)}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={gridCols === 4 ? "secondary" : "ghost"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setGridCols(4)}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <ProductsFilters
                    categories={categories}
                    brands={brands}
                    availableTags={availableTags}
                    allProductsCount={initialProducts.length}
                    currentCategoryId={currentCategoryId}
                    onFiltersChange={handleFiltersChange}
                />
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar Filters */}
                <ProductsFilters
                    categories={categories}
                    brands={brands}
                    availableTags={availableTags}
                    allProductsCount={initialProducts.length}
                    currentCategoryId={currentCategoryId}
                    onFiltersChange={handleFiltersChange}
                    showSidebar={true}
                />

                {/* Products Grid */}
                <div className="flex-1">
                    <ProductsGrid
                        products={filteredProducts}
                        categories={categories}
                        gridCols={gridCols}
                    />
                </div>
            </div>
        </main>
    );
}
