import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";

// Server-side data fetching for featured products
async function getFeaturedProducts() {
  try {
    const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

    const res = await fetch(`${baseUrl}/products?featured=true`, {
      next: { revalidate: 1800 } // ISR - revalidate every 30 minutes
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    const products = data.products || data; // Handle both paginated and non-paginated responses
    return products.slice(0, 8); // محدود به 8 محصول
  } catch (error) {
    console.error("Failed to load featured products:", error);
    return [];
  }
}

// Helper function to format price
function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24" id="featured">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              محصولات ویژه
            </h2>
            <p className="text-muted-foreground md:text-lg">
              بهترین محصولات با کیفیت‌ترین برندها
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              مشاهده همه محصولات
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const productImage = product.image || (product.images && product.images[0]) || '';
            const brandName = typeof product.brand === 'string' 
              ? product.brand 
              : product.brand?.name || '';
            
            return (
              <Link key={product.id} href={`/product/${product.slug || product.id}`} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {productImage && (
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                        ویژه
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-right line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {brandName && (
                        <p className="text-sm text-muted-foreground text-right">
                          {brandName}
                        </p>
                      )}
                    </div>

                    {product.rating && (
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm font-medium">{product.rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-9 w-9">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatPrice(product.price || product.basePrice)} <span className="text-sm">تومان</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}