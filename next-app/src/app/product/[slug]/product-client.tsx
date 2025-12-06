"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Star, Truck, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product, Category, ProductVariant } from "@/lib/api";
import { fetchVariantsByProduct } from "@/lib/api";

const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return '0';
    return Number(price).toLocaleString('fa-IR');
};

interface ProductClientProps {
    product: Product;
    category: Category;
}

export default function ProductClient({ product, category }: ProductClientProps) {
    const { addToCart } = useCart();
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const productImages = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);
    const currentImage = productImages[selectedImageIndex] || productImages[0] || '';

    // Load variants
    useEffect(() => {
        if (product.hasVariants && product.id) {
            setLoadingVariants(true);
            fetchVariantsByProduct(product.id)
                .then((data) => {
                    setVariants(data);
                    const defaultVariant = data.find(v => v.isDefault) || data[0];
                    if (defaultVariant) {
                        setSelectedVariant(defaultVariant);
                    }
                })
                .catch(console.error)
                .finally(() => setLoadingVariants(false));
        }
    }, [product.id, product.hasVariants]);

    const handleAddToCart = () => {
        const itemToAdd = selectedVariant
            ? { ...product, price: selectedVariant.price, variantId: selectedVariant.id }
            : product;

        addToCart(itemToAdd);
        toast.success("محصول به سبد خرید اضافه شد");
    };

    // Ensure we always have a valid price
    const currentPrice = selectedVariant?.price
        || product.price
        || product.basePrice
        || 0;

    console.log('ProductClient debug:', {
        id: product.id,
        name: product.name,
        currentPrice,
        type: typeof currentPrice,
        minPrice: product.minPrice,
        variantPrice: selectedVariant?.price,
        productPrice: product.price,
        basePrice: product.basePrice
    });

    const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
    const currentImageFromVariant = selectedVariant?.image || currentImage;

    const brandName = typeof product.brand === 'string'
        ? product.brand
        : product.brand?.name || '';
    const subcategoryName = typeof product.subcategory === 'string'
        ? product.subcategory
        : product.subcategory?.name || '';

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">خانه</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-foreground">محصولات</Link>
                <span>/</span>
                <Link href={`/products/${category.id}`} className="hover:text-foreground">{category.name}</Link>
                <span>/</span>
                <span className="text-foreground">{product.name}</span>
            </div>

            <div className="mb-6">
                <Link href={`/products/${category.id}`} className="text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit">
                    <ArrowRight className="h-4 w-4" />
                    بازگشت به {category.name}
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square md:aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                        {currentImageFromVariant && (
                            <Image
                                src={currentImageFromVariant}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        )}
                    </div>

                    {productImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-primary'
                                        : 'border-transparent hover:border-muted-foreground'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - تصویر ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6 text-right">
                    <div>
                        {subcategoryName && (
                            <div className="text-muted-foreground mb-2">{subcategoryName}</div>
                        )}
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        {brandName && (
                            <p className="text-muted-foreground mb-2">برند: {brandName}</p>
                        )}
                        <div className="flex items-center gap-1 mb-4 justify-end">
                            {product.rating ? (
                                <>
                                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating!) ? 'fill-current' : 'opacity-50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>
                        <p className="text-3xl font-bold text-primary">
                            {formatPrice(currentPrice)} تومان
                        </p>
                        {product.minPrice && product.minPrice !== currentPrice && product.minPrice > 0 && (
                            <p className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.minPrice)} تومان
                            </p>
                        )}
                        {currentStock > 0 ? (
                            <p className="text-sm text-green-600 mt-2">موجود در انبار ({currentStock} عدد)</p>
                        ) : (
                            <p className="text-sm text-red-600 mt-2">ناموجود</p>
                        )}
                    </div>

                    {/* Variants Selection */}
                    {variants.length > 0 && (
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold text-lg">انتخاب نوع:</h3>

                            {/* Color Variants */}
                            {variants.some(v => v.color) && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">رنگ:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.filter(v => v.color).map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${selectedVariant?.id === variant.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-muted hover:border-primary/50'
                                                    }`}
                                            >
                                                {variant.colorCode && (
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-muted-foreground/20"
                                                        style={{ backgroundColor: variant.colorCode }}
                                                    />
                                                )}
                                                <span className="text-sm">{variant.color}</span>
                                                {variant.stock === 0 && (
                                                    <span className="text-xs text-red-600">(ناموجود)</span>
                                                )}
                                                {selectedVariant?.id === variant.id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Variants */}
                            {variants.some(v => v.size) && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">سایز / حجم:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.filter(v => v.size).map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariant?.id === variant.id
                                                    ? 'border-primary bg-primary/10 font-semibold'
                                                    : 'border-muted hover:border-primary/50'
                                                    }`}
                                            >
                                                {variant.size}
                                                {variant.stock === 0 && (
                                                    <span className="text-xs text-red-600 mr-1">(ناموجود)</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Generic Variants */}
                            {variants.filter(v => !v.color && !v.size).length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">نوع:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.filter(v => !v.color && !v.size).map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariant?.id === variant.id
                                                    ? 'border-primary bg-primary/10 font-semibold'
                                                    : 'border-muted hover:border-primary/50'
                                                    }`}
                                            >
                                                {variant.name}
                                                {variant.stock === 0 && (
                                                    <span className="text-xs text-red-600 mr-1">(ناموجود)</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="prose prose-stone dark:prose-invert max-w-none text-right">
                        {product.description && <p>{product.description}</p>}
                        <p>
                            این محصول با استفاده از بهترین مواد اولیه تهیه شده و مناسب برای انواع پوست/مو می‌باشد.
                            کیفیت تضمین شده و دارای تاییدیه بهداشتی.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <Button
                            size="lg"
                            className="w-full sm:w-1/2 text-lg"
                            onClick={handleAddToCart}
                            disabled={currentStock === 0 || loadingVariants}
                        >
                            {currentStock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                            <Truck className="h-8 w-8 text-primary" />
                            <div className="text-sm">
                                <p className="font-semibold">ارسال سریع</p>
                                <p className="text-muted-foreground">تحویل ۲ تا ۳ روز کاری</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                            <div className="text-sm">
                                <p className="font-semibold">ضمانت اصالت</p>
                                <p className="text-muted-foreground">تضمین بازگشت وجه</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
