import { Card, CardContent } from "@/components/ui/card";

export default function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-muted/50 animate-pulse">
                {/* Image skeleton */}
            </div>
            <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                    {/* Title skeleton */}
                    <div className="h-5 bg-muted/50 rounded animate-pulse w-3/4" />
                    {/* Brand skeleton */}
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
                </div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-1 justify-end">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-8" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    {/* Button skeleton */}
                    <div className="h-9 w-9 bg-muted/50 rounded-md animate-pulse" />

                    {/* Price skeleton */}
                    <div className="space-y-1">
                        <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
