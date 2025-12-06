"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageLoading } from "@/hooks/use-page-loading";
import type { Category, Brand } from "@/lib/api";

interface ProductsFiltersProps {
    categories: Category[];
    brands: Brand[];
    availableTags: string[];
    allProductsCount: number;
    currentCategoryId?: string | null;
    onFiltersChange: (filters: {
        selectedSubcategories: string[];
        selectedBrands: string[];
        selectedTags: string[];
        searchQuery: string;
        sortBy: string;
    }) => void;
    showSidebar?: boolean;
}

export default function ProductsFilters({
    categories,
    brands,
    availableTags,
    allProductsCount,
    currentCategoryId,
    onFiltersChange,
    showSidebar = false,
}: ProductsFiltersProps) {
    const pathname = usePathname();
    const { handleNavigationClick } = usePageLoading();
    
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [accordionOpen, setAccordionOpen] = useState<string[]>(["categories"]);

    // Notify parent of filter changes
    useEffect(() => {
        onFiltersChange({
            selectedSubcategories,
            selectedBrands,
            selectedTags,
            searchQuery,
            sortBy,
        });
    }, [selectedSubcategories, selectedBrands, selectedTags, searchQuery, sortBy, onFiltersChange]);

    const handleSubcategoryChange = (subcategoryId: string) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategoryId)
                ? prev.filter((s) => s !== subcategoryId)
                : [...prev, subcategoryId]
        );
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brandId)
                ? prev.filter((b) => b !== brandId)
                : [...prev, brandId]
        );
    };

    const handleTagChange = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    const clearAllFilters = () => {
        setSelectedSubcategories([]);
        setSelectedBrands([]);
        setSelectedTags([]);
        setSearchQuery("");
    };

    const activeFiltersCount = selectedSubcategories.length + selectedBrands.length + selectedTags.length + (searchQuery ? 1 : 0);

    const availableSubcategories = useMemo(() => {
        if (currentCategoryId) {
            const category = categories.find((c) => c.id === currentCategoryId);
            return category?.subcategories || [];
        }
        return categories.flatMap((c) => c.subcategories || []);
    }, [currentCategoryId, categories]);

    // Filter brands based on current category
    const availableBrandsForCategory = useMemo(() => {
        if (!currentCategoryId) return brands;
        // You could filter brands based on products in this category
        // For now, return all brands
        return brands;
    }, [currentCategoryId, brands]);

    const Filters = () => (
        <div className="space-y-6">
            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <X className="h-4 w-4 ml-2" />
                    پاک کردن فیلترها ({activeFiltersCount})
                </Button>
            )}

            <Accordion 
                type="multiple" 
                value={accordionOpen}
                onValueChange={setAccordionOpen}
                className="w-full"
            >
                <AccordionItem value="categories">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                        دسته‌بندی‌ها
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            <Link
                                href="/products"
                                onClick={(e) => handleNavigationClick('/products', e)}
                                className={cn(
                                    "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all",
                                    pathname === '/products'
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span>همه محصولات</span>
                                <Badge variant={pathname === '/products' ? "secondary" : "outline"} className="text-xs">
                                    {allProductsCount}
                                </Badge>
                            </Link>
                            
                            {categories.map((category) => {
                                const isActive = currentCategoryId === category.id;
                                const categoryHref = `/products/${category.id}`;
                                
                                return (
                                    <Link
                                        key={category.id}
                                        href={categoryHref}
                                        onClick={(e) => handleNavigationClick(categoryHref, e)}
                                        className={cn(
                                            "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span>{category.name}</span>
                                        {category.productsCount !== undefined && (
                                            <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                                                {category.productsCount}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {availableSubcategories.length > 0 && (
                    <AccordionItem value="subcategories">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                            زیردسته‌ها
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto">
                                {availableSubcategories.map((subcategory) => (
                                    <div key={subcategory.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={`sub-${subcategory.id}`}
                                            checked={selectedSubcategories.includes(subcategory.id)}
                                            onCheckedChange={() => handleSubcategoryChange(subcategory.id)}
                                        />
                                        <Label
                                            htmlFor={`sub-${subcategory.id}`}
                                            className="flex-1 text-sm cursor-pointer hover:text-primary transition-colors"
                                        >
                                            {subcategory.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {availableBrandsForCategory.length > 0 && (
                    <AccordionItem value="brands">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                            برندها
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto">
                                {availableBrandsForCategory.map((brand) => (
                                    <div key={brand.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={`brand-${brand.id}`}
                                            checked={selectedBrands.includes(brand.id)}
                                            onCheckedChange={() => handleBrandChange(brand.id)}
                                        />
                                        <Label
                                            htmlFor={`brand-${brand.id}`}
                                            className="flex-1 text-sm cursor-pointer hover:text-primary transition-colors"
                                        >
                                            {brand.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {availableTags.length > 0 && (
                    <AccordionItem value="tags">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                            ویژگی‌ها / تگ‌ها
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto">
                                {availableTags.map((tag) => (
                                    <div key={tag} className="flex items-center gap-3">
                                        <Checkbox
                                            id={`tag-${tag}`}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() => handleTagChange(tag)}
                                        />
                                        <Label
                                            htmlFor={`tag-${tag}`}
                                            className="flex-1 text-sm cursor-pointer hover:text-primary transition-colors"
                                        >
                                            {tag}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );

    if (showSidebar) {
        return (
            <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 p-6 border rounded-2xl bg-card/50 backdrop-blur-sm shadow-sm">
                    <Filters />
                </div>
            </aside>
        );
    }

    return (
        <>
            {/* Search Bar */}
            <div className="relative max-w-xl">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="جستجو در نام، برند یا تگ محصولات..."
                    className="pr-10 h-12 text-base bg-background border-muted-foreground/20 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setSearchQuery("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Active Filters Tags */}
            {(selectedSubcategories.length > 0 || selectedBrands.length > 0 || selectedTags.length > 0 || searchQuery) && (
                <div className="flex flex-wrap gap-2">
                    {selectedSubcategories.map(subId => {
                        const sub = availableSubcategories.find(s => s.id === subId);
                        return sub ? (
                            <Badge
                                key={subId}
                                variant="outline"
                                className="gap-1 px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                                onClick={() => handleSubcategoryChange(subId)}
                            >
                                {sub.name}
                                <X className="h-3 w-3" />
                            </Badge>
                        ) : null;
                    })}
                    {selectedBrands.map(brandId => {
                        const brand = brands.find(b => b.id === brandId);
                        return brand ? (
                            <Badge
                                key={brandId}
                                variant="outline"
                                className="gap-1 px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                                onClick={() => handleBrandChange(brandId)}
                            >
                                {brand.name}
                                <X className="h-3 w-3" />
                            </Badge>
                        ) : null;
                    })}
                    {selectedTags.map(tag => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="gap-1 px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                            onClick={() => handleTagChange(tag)}
                        >
                            {tag}
                            <X className="h-3 w-3" />
                        </Badge>
                    ))}
                    {searchQuery && (
                        <Badge
                            variant="outline"
                            className="gap-1 px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                            onClick={() => setSearchQuery("")}
                        >
                            جستجو: {searchQuery}
                            <X className="h-3 w-3" />
                        </Badge>
                    )}
                </div>
            )}

            {/* Sort and Mobile Filter */}
            <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] bg-background">
                        <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">جدیدترین</SelectItem>
                        <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                        <SelectItem value="price-high">گران‌ترین</SelectItem>
                        <SelectItem value="rating">محبوب‌ترین</SelectItem>
                    </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden gap-2">
                            <Filter className="h-4 w-4" />
                            فیلتر
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[320px] overflow-y-auto">
                        <SheetTitle className="text-right mb-6">فیلتر محصولات</SheetTitle>
                        <Filters />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
