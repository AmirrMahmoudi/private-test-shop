"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import CategoryFilters from "./category-filters";
import ProductsGrid from "../products-grid";
import type { Product, Category } from "@/lib/api";

interface CategoryClientProps {
    category: Category;
    products: Product[];
    allCategories: Category[];
    allProducts?: Product[];
}

export default function CategoryClient({
    category,
    products,
    allCategories,
    allProducts = []
}: CategoryClientProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-muted/30 py-12 md:py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            {category.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {products.length} محصول
                        </p>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 mx-auto py-12">
                <CategoryFilters products={products} category={category} allCategories={allCategories} allProducts={allProducts}>
                    {(filteredProducts, filterControls) => (
                        <div className="flex gap-8">
                            {/* Sidebar Filters - Desktop */}
                            <aside className="hidden lg:block w-72 shrink-0">
                                <div className="sticky top-24 p-6 border rounded-2xl bg-card/50 backdrop-blur-sm shadow-sm">
                                    <div className="space-y-6">
                                        <Accordion
                                            type="multiple"
                                            defaultValue={["categories", "subcategories"]}
                                            className="w-full"
                                        >
                                            <AccordionItem value="categories">
                                                <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                                                    دسته‌بندی‌ها
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-3 pt-2">
                                                        {allCategories.map((cat) => {
                                                            const isActive = cat.id === category.id;
                                                            return (
                                                                <Link
                                                                    key={cat.id}
                                                                    href={`/products/${cat.id}`}
                                                                    className={cn(
                                                                        "flex items-center justify-between py-2 px-3 rounded-lg transition-all",
                                                                        isActive
                                                                            ? "bg-accent text-accent-foreground font-medium"
                                                                            : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                                                    )}
                                                                >
                                                                    <span>{cat.name}</span>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {allProducts.length > 0
                                                                            ? allProducts.filter(p => p.categoryId === cat.id || (typeof p.category === 'object' ? p.category?.id === cat.id : p.category === cat.id)).length
                                                                            : products.filter(p => p.categoryId === cat.id || (typeof p.category === 'object' ? p.category?.id === cat.id : p.category === cat.id)).length}
                                                                    </Badge>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            {filterControls.availableSubcategories.length > 0 && (
                                                <AccordionItem value="subcategories">
                                                    <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                                                        زیردسته‌ها
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-3 pt-2">
                                                            {filterControls.selectedSubcategories.length > 0 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={filterControls.clearFilters}
                                                                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <X className="h-4 w-4 ml-2" />
                                                                    پاک کردن فیلترها ({filterControls.selectedSubcategories.length})
                                                                </Button>
                                                            )}
                                                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                                                {filterControls.availableSubcategories.map((subcategory) => {
                                                                    const subId = typeof subcategory === 'string' ? subcategory : subcategory.id;
                                                                    const subName = typeof subcategory === 'string' ? subcategory : subcategory.name;
                                                                    return (
                                                                        <div key={subId} className="flex items-center gap-3">
                                                                            <Checkbox
                                                                                id={`sub-sidebar-${subId}`}
                                                                                checked={filterControls.selectedSubcategories.includes(subId)}
                                                                                onCheckedChange={() => filterControls.handleSubcategoryChange(subId)}
                                                                            />
                                                                            <Label
                                                                                htmlFor={`sub-sidebar-${subId}`}
                                                                                className="flex-1 text-sm cursor-pointer hover:text-primary transition-colors"
                                                                            >
                                                                                {subName}
                                                                            </Label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}
                                        </Accordion>
                                    </div>
                                </div>
                            </aside>

                            {/* Products Grid */}
                            <div className="flex-1">
                                <ProductsGrid
                                    products={filteredProducts}
                                    categories={allCategories}
                                />
                            </div>
                        </div>
                    )}
                </CategoryFilters>
            </div>
        </div>
    );
}
