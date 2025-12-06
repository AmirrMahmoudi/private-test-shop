import NavbarServer from "@/components/NavbarServer";
import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import CategoryCardSkeleton from "@/components/skeletons/CategoryCardSkeleton";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-background">
            <NavbarServer />
            <main>
                {/* Hero Section Skeleton */}
                <HeroSkeleton />

                {/* Category Showcase Skeleton */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="space-y-4 mb-12 text-center">
                            <div className="h-10 bg-muted/50 rounded animate-pulse w-64 mx-auto" />
                            <div className="h-6 bg-muted/50 rounded animate-pulse w-96 mx-auto" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <CategoryCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products Skeleton */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                            <div className="space-y-2">
                                <div className="h-10 bg-muted/50 rounded animate-pulse w-48" />
                                <div className="h-6 bg-muted/50 rounded animate-pulse w-64" />
                            </div>
                            <div className="h-10 bg-muted/50 rounded-lg animate-pulse w-44" />
                        </div>
                        <ProductGridSkeleton count={8} />
                    </div>
                </section>
            </main>
            <footer className="bg-muted py-8 text-center text-muted-foreground">
                <p>© ۱۴۰۳ فروشگاه لوازم آرایشی بیوتی‌شاپ. تمامی حقوق محفوظ است.</p>
            </footer>
        </div>
    );
}
