"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, User, X, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { usePageLoading } from "@/hooks/use-page-loading";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    category: string;
    slug?: string;
}

interface NavbarClientProps {
    categories: Category[];
    products: Product[];
}

export default function NavbarClient({ categories, products }: NavbarClientProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentProductCategory, setCurrentProductCategory] = useState<string | null>(null);
    const { handleNavigationClick } = usePageLoading();
    const pathname = usePathname();

    // Get category IDs for quick lookup
    const categoryIds = useMemo(() => categories.map(cat => cat.id), [categories]);

    // Extract the last segment from pathname (category ID or product slug)
    const pathSegment = useMemo(() => {
        if (pathname.startsWith('/products/') && pathname !== '/products') {
            return pathname.split('/products/')[1];
        }
        if (pathname.startsWith('/product/')) {
            return pathname.split('/product/')[1];
        }
        return null;
    }, [pathname]);

    // Check if pathSegment is a category ID
    const isPathCategory = useMemo(() => {
        return pathSegment ? categoryIds.includes(pathSegment) : false;
    }, [pathSegment, categoryIds]);

    // Fetch product category when on a product page
    useEffect(() => {
        if (pathSegment && !isPathCategory) {
            // First check in local products array
            const localProduct = products.find((p: Product) =>
                (p.slug && p.slug === pathSegment) || p.id === pathSegment
            );

            if (localProduct) {
                setCurrentProductCategory(localProduct.category);
            } else {
                // If not found locally, fetch from API
                const fetchProductCategory = async () => {
                    try {
                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
                        const res = await fetch(`${baseUrl}/products/${pathSegment}`);
                        if (res.ok) {
                            const product = await res.json();
                            setCurrentProductCategory(product.category);
                        } else {
                            setCurrentProductCategory(null);
                        }
                    } catch (error) {
                        setCurrentProductCategory(null);
                    }
                };
                fetchProductCategory();
            }
        } else {
            setCurrentProductCategory(null);
        }
    }, [pathSegment, isPathCategory, products]);

    // Find the active category - either direct match or from product's category
    const activeCategoryId = useMemo(() => {
        if (pathname === '/products') return null;
        if (isPathCategory && pathSegment) return pathSegment;
        // If it's a product slug, use the fetched category
        if (pathSegment && !isPathCategory) {
            return currentProductCategory;
        }
        return null;
    }, [pathname, isPathCategory, pathSegment, currentProductCategory]);

    // Check if a category is active
    const isCategoryActive = (categoryId: string) => {
        return activeCategoryId === categoryId;
    };

    const isProductsPageActive = pathname === '/products' || pathname.startsWith('/products/');

    // Handle navigation click and close sheet
    const handleNavClick = (href: string, e?: React.MouseEvent) => {
        // Start loading and let Link handle navigation
        handleNavigationClick(href, e);
        setIsSheetOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 md:h-18 flex items-center justify-between gap-4">
                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-muted rounded-full">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[320px] p-0 border-r-0">
                            {/* Header */}
                            <div className="p-6 border-b bg-gradient-to-l from-primary/5 to-transparent">
                                <SheetTitle className="text-right text-xl font-bold flex items-center justify-end gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    بیوتی‌شاپ
                                </SheetTitle>
                                <p className="text-sm text-muted-foreground text-right mt-1">فروشگاه لوازم آرایشی</p>
                            </div>

                            {/* Navigation */}
                            <nav className="flex flex-col p-4 text-right overflow-y-auto max-h-[calc(100vh-180px)]">
                                <Link
                                    href="/"
                                    onClick={(e) => handleNavClick('/', e)}
                                    className={cn(
                                        "flex items-center justify-between py-3.5 px-4 text-base font-medium rounded-xl transition-all",
                                        pathname === '/'
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                                    صفحه اصلی
                                </Link>

                                <Link
                                    href="/products"
                                    onClick={(e) => handleNavClick('/products', e)}
                                    className={cn(
                                        "flex items-center justify-between py-3.5 px-4 text-base font-medium rounded-xl transition-all",
                                        pathname === '/products' && !activeCategoryId
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                                    همه محصولات
                                </Link>

                                <div className="h-px bg-border my-3" />

                                <p className="text-xs font-medium text-muted-foreground px-4 mb-2">دسته‌بندی‌ها</p>

                                {categories.map((category) => {
                                    const count = products.filter(p => p.category === category.id).length;
                                    const isActive = isCategoryActive(category.id);
                                    const categoryHref = `/products/${category.id}`;
                                    return (
                                        <Link
                                            key={category.id}
                                            href={categoryHref}
                                            onClick={(e) => handleNavClick(categoryHref, e)}
                                            className={cn(
                                                "flex items-center justify-between py-3 px-4 text-base rounded-xl transition-all group",
                                                isActive
                                                    ? "bg-accent text-accent-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ChevronLeft className={cn(
                                                    "h-4 w-4 transition-all",
                                                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                                )} />
                                                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                                                    {count}
                                                </Badge>
                                            </div>
                                            {category.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Footer Actions */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                                <div className="flex gap-2">
                                    <Link href="/login" onClick={(e) => handleNavClick('/login', e)} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-full gap-2">
                                            <User className="h-4 w-4" />
                                            ورود
                                        </Button>
                                    </Link>
                                    <Link href="/cart" onClick={(e) => handleNavClick('/cart', e)} className="flex-1">
                                        <Button className="w-full rounded-full gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            سبد خرید
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link
                    href="/"
                    onClick={(e) => handleNavigationClick('/', e)}
                    className="flex items-center gap-2 text-xl md:text-2xl font-extrabold text-primary hover:opacity-90 transition-opacity"
                >
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6 hidden sm:block" />
                    بیوتی‌شاپ
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
                    <Link
                        href="/products"
                        onClick={(e) => handleNavigationClick('/products', e)}
                        className={cn(
                            "px-3 py-2 text-sm font-medium rounded-lg transition-all relative",
                            pathname === '/products' && !activeCategoryId
                                ? "text-primary bg-accent"
                                : "text-foreground hover:text-primary hover:bg-accent"
                        )}
                    >
                        همه محصولات
                        {pathname === '/products' && !activeCategoryId && (
                            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </Link>
                    {categories.slice(0, 5).map((category) => {
                        const isActive = isCategoryActive(category.id);
                        const categoryHref = `/products/${category.id}`;
                        return (
                            <Link
                                key={category.id}
                                href={categoryHref}
                                onClick={(e) => handleNavigationClick(categoryHref, e)}
                                className={cn(
                                    "px-3 py-2 text-sm font-medium rounded-lg transition-all relative group",
                                    isActive
                                        ? "text-primary bg-accent"
                                        : "text-muted-foreground hover:text-primary hover:bg-accent"
                                )}
                            >
                                {category.name}
                                <span className={cn(
                                    "absolute bottom-0 right-0 left-0 h-0.5 bg-primary transition-transform origin-right rounded-full",
                                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                    {/* Desktop Search */}
                    <div className="hidden lg:flex relative items-center">
                        <Input
                            type="search"
                            placeholder="جستجو..."
                            className="w-[180px] lg:w-[220px] pl-9 pr-4 h-10 text-right bg-muted/50 hover:bg-muted focus:bg-background border-transparent hover:border-input focus:border-input rounded-full transition-all"
                        />
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Mobile Search Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-10 w-10 hover:bg-muted rounded-full"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Cart */}
                    <Link href="/cart" onClick={(e) => handleNavigationClick('/cart', e)}>
                        <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted rounded-full">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">سبد خرید</span>
                        </Button>
                    </Link>

                    {/* User - Desktop */}
                    <Link href="/login" onClick={(e) => handleNavigationClick('/login', e)} className="hidden lg:block">
                        <Button variant="outline" size="sm" className="h-10 gap-2 rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-all">
                            <User className="h-4 w-4" />
                            ورود / ثبت‌نام
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className={`lg:hidden border-t overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 bg-background/95 backdrop-blur-sm">
                    <div className="relative w-full">
                        <Input
                            type="search"
                            placeholder="جستجو در محصولات..."
                            className="w-full pl-10 pr-4 h-11 text-right rounded-full bg-muted/50 border-muted-foreground/20"
                            autoFocus={isSearchOpen}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </header>
    );
}

