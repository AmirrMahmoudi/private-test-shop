import NavbarServer from "@/components/NavbarServer";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
            <NavbarServer />

            <div className="container px-4 md:px-6 mx-auto py-8">
                {/* Header Skeleton */}
                <div className="mb-8 space-y-4">
                    <div className="h-10 bg-muted/50 rounded animate-pulse w-48" />
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-96" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Skeleton */}
                    <aside className="lg:w-64 space-y-6">
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="h-6 bg-muted/50 rounded animate-pulse w-32" />
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid Skeleton */}
                    <div className="flex-1">
                        {/* Sort and view options */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-6 bg-muted/50 rounded animate-pulse w-32" />
                            <div className="flex gap-2">
                                <div className="h-10 bg-muted/50 rounded animate-pulse w-32" />
                                <div className="h-10 bg-muted/50 rounded animate-pulse w-20" />
                            </div>
                        </div>

                        <ProductGridSkeleton count={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}
