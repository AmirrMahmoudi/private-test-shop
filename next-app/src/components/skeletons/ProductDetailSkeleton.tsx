export default function ProductDetailSkeleton() {
    return (
        <div className="container px-4 md:px-6 mx-auto py-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    {/* Main image */}
                    <div className="relative aspect-square bg-muted/50 rounded-lg animate-pulse" />

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-muted/50 rounded-md animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-1/3" />

                    {/* Title */}
                    <div className="space-y-3">
                        <div className="h-8 bg-muted/50 rounded animate-pulse w-full" />
                        <div className="h-8 bg-muted/50 rounded animate-pulse w-4/5" />
                    </div>

                    {/* Brand and Rating */}
                    <div className="flex items-center justify-between">
                        <div className="h-5 bg-muted/50 rounded animate-pulse w-24" />
                        <div className="h-5 bg-muted/50 rounded animate-pulse w-20" />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="h-10 bg-muted/50 rounded animate-pulse w-40" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                        <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                        <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                    </div>

                    {/* Variants */}
                    <div className="space-y-3">
                        <div className="h-5 bg-muted/50 rounded animate-pulse w-24" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-10 w-20 bg-muted/50 rounded-md animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-full" />
                        <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
