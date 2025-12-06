import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { Search } from "lucide-react";
import type { Product, Category } from "@/lib/api";

interface ProductsGridProps {
    products: Product[];
    categories: Category[];
    gridCols?: 3 | 4;
}

export default function ProductsGrid({ products, categories, gridCols = 3 }: ProductsGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">محصولی یافت نشد</h3>
                <p className="text-muted-foreground mb-4">لطفاً فیلترها یا عبارت جستجو را تغییر دهید</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
            {products.map((product) => {
                const productHref = `/product/${product.slug || product.id}`;
                const productImage = product.image || (product.images && product.images[0]) || '';
                const categoryName = typeof product.category === 'string'
                    ? categories.find((c) => c.id === product.category)?.name || product.category
                    : product.category?.name || '';
                const brandName = typeof product.brand === 'string'
                    ? product.brand
                    : product.brand?.name || '';
                const subcategoryName = typeof product.subcategory === 'string'
                    ? product.subcategory
                    : product.subcategory?.name || '';
                const displayPrice = product.minPrice && product.minPrice !== product.price
                    ? product.minPrice
                    : product.price;

                return (
                    <Card
                        key={product.id}
                        className="group overflow-hidden flex flex-col h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-card rounded-2xl relative"
                    >
                        <Link
                            href={productHref}
                            className="relative aspect-square overflow-hidden bg-muted"
                        >
                            {productImage && (
                                <Image
                                    src={productImage}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                            <div className="absolute bottom-4 right-4 left-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <Button className="w-full rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg font-medium">
                                    مشاهده سریع
                                </Button>
                            </div>

                            {product.isFeatured && (
                                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                                    ویژه
                                </Badge>
                            )}

                            {product.hasVariants && product.variantsCount && product.variantsCount > 1 && (
                                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                                    {product.variantsCount} نوع
                                </Badge>
                            )}
                        </Link>

                        <CardContent className="p-5 flex-1 flex flex-col text-right">
                            <div className="flex items-center justify-between mb-2">
                                {categoryName && (
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                                        {categoryName}
                                    </span>
                                )}
                                {brandName && (
                                    <span className="text-xs text-muted-foreground">
                                        {brandName}
                                    </span>
                                )}
                            </div>

                            <Link href={productHref}>
                                <h3 className="font-bold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            {subcategoryName && (
                                <p className="text-sm text-muted-foreground mb-3">{subcategoryName}</p>
                            )}

                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {product.tags.slice(0, 2).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {product.tags.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{product.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {product.rating && (
                                <div className="flex items-center gap-1 mb-3">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{product.rating}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                <div>
                                    <p className="font-bold text-lg">
                                        {displayPrice.toLocaleString('fa-IR')}
                                        <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
                                    </p>
                                    {product.minPrice && product.minPrice !== product.price && (
                                        <p className="text-xs text-muted-foreground line-through">
                                            {product.price.toLocaleString('fa-IR')} تومان
                                        </p>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </div>

                            {product.stock === 0 && (
                                <Badge variant="destructive" className="mt-2 w-fit">
                                    ناموجود
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
