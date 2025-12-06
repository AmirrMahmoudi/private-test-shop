"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X } from "lucide-react";
import type { Product } from "@/lib/api";

interface CategoryFiltersProps {
    products: Product[];
    category: any;
    allCategories: any[];
    allProducts?: Product[];
    children: (filteredProducts: Product[], filterControls: {
        selectedSubcategories: string[];
        availableSubcategories: Array<{ id: string; name: string } | string>;
        handleSubcategoryChange: (subcategoryId: string) => void;
        clearFilters: () => void;
    }) => React.ReactNode;
}

export default function CategoryFilters({ products, category, allCategories, allProducts = [], children }: CategoryFiltersProps) {
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [accordionOpen, setAccordionOpen] = useState<string[]>(["subcategories"]);

    const filteredProducts = useMemo(() => {
        if (selectedSubcategories.length === 0) return products;
        return products.filter(p => {
            const subcategoryId = typeof p.subcategory === 'string' 
                ? p.subcategory 
                : p.subcategory?.id || p.subcategoryId;
            return selectedSubcategories.includes(subcategoryId || '');
        });
    }, [products, selectedSubcategories]);

    const availableSubcategories = useMemo(() => {
        const subs = new Map<string, { id: string; name: string }>();
        
        // First, get subcategories from category object
        if (category?.subcategories && Array.isArray(category.subcategories)) {
            category.subcategories.forEach((sub: any) => {
                if (typeof sub === 'object' && sub.id) {
                    subs.set(sub.id, { id: sub.id, name: sub.name });
                } else if (typeof sub === 'string') {
                    subs.set(sub, { id: sub, name: sub });
                }
            });
        }
        
        // Also extract from products
        products.forEach(p => {
            if (typeof p.subcategory === 'object' && p.subcategory?.id) {
                subs.set(p.subcategory.id, { id: p.subcategory.id, name: p.subcategory.name });
            } else if (p.subcategoryId) {
                if (!subs.has(p.subcategoryId)) {
                    subs.set(p.subcategoryId, { id: p.subcategoryId, name: p.subcategoryId });
                }
            } else if (typeof p.subcategory === 'string') {
                subs.set(p.subcategory, { id: p.subcategory, name: p.subcategory });
            }
        });
        
        return Array.from(subs.values());
    }, [products, category]);

    const handleSubcategoryChange = (subcategoryId: string) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategoryId)
                ? prev.filter((s) => s !== subcategoryId)
                : [...prev, subcategoryId]
        );
    };

    const clearFilters = () => {
        setSelectedSubcategories([]);
    };

    return (
        <>
            {/* Mobile Subcategory Filters */}
            {availableSubcategories.length > 0 && (
                <div className="lg:hidden mb-6">
                    <Accordion 
                        type="multiple" 
                        value={accordionOpen}
                        onValueChange={setAccordionOpen}
                        className="w-full"
                    >
                        <AccordionItem value="subcategories">
                            <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                                زیردسته‌ها
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pt-2">
                                    {selectedSubcategories.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <X className="h-4 w-4 ml-2" />
                                            پاک کردن فیلترها ({selectedSubcategories.length})
                                        </Button>
                                    )}
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                        {availableSubcategories.map((subcategory) => {
                                            const subId = typeof subcategory === 'string' ? subcategory : subcategory.id;
                                            const subName = typeof subcategory === 'string' ? subcategory : subcategory.name;
                                            return (
                                                <div key={subId} className="flex items-center gap-3">
                                                    <Checkbox
                                                        id={`sub-${subId}`}
                                                        checked={selectedSubcategories.includes(subId)}
                                                        onCheckedChange={() => handleSubcategoryChange(subId)}
                                                    />
                                                    <Label
                                                        htmlFor={`sub-${subId}`}
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
                    </Accordion>
                </div>
            )}

            {/* Render filtered products with sidebar */}
            {children(filteredProducts, {
                selectedSubcategories,
                availableSubcategories,
                handleSubcategoryChange,
                clearFilters,
            })}
        </>
    );
}
