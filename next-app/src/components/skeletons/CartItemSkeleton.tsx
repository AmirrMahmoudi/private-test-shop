export default function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 border rounded-lg">
            {/* Image skeleton */}
            <div className="w-24 h-24 bg-muted/50 rounded-md animate-pulse flex-shrink-0" />

            <div className="flex-1 space-y-3">
                {/* Title skeleton */}
                <div className="h-5 bg-muted/50 rounded animate-pulse w-3/4" />

                {/* Details skeleton */}
                <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />

                {/* Price and quantity skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-5 bg-muted/50 rounded animate-pulse w-24" />
                    <div className="h-8 bg-muted/50 rounded animate-pulse w-24" />
                </div>
            </div>

            {/* Remove button skeleton */}
            <div className="h-8 w-8 bg-muted/50 rounded animate-pulse" />
        </div>
    );
}
