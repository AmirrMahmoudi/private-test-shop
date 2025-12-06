import { Card, CardContent } from "@/components/ui/card";

export default function CategoryCardSkeleton() {
    return (
        <Card className="group overflow-hidden transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/50 animate-pulse">
                {/* Image skeleton */}
            </div>
            <CardContent className="p-4">
                <div className="space-y-2">
                    {/* Title skeleton */}
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-3/4 mx-auto" />
                    {/* Description skeleton */}
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2 mx-auto" />
                </div>
            </CardContent>
        </Card>
    );
}
