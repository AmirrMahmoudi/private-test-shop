import NavbarServer from "@/components/NavbarServer";
import CartItemSkeleton from "@/components/skeletons/CartItemSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <NavbarServer />

            <div className="container px-4 md:px-6 mx-auto py-8">
                <div className="mb-8">
                    <div className="h-10 bg-muted/50 rounded animate-pulse w-48" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items Skeleton */}
                    <div className="lg:col-span-2 space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CartItemSkeleton key={i} />
                        ))}
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 space-y-4 sticky top-24">
                            <div className="h-7 bg-muted/50 rounded animate-pulse w-32" />

                            <div className="space-y-3 py-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-5 bg-muted/50 rounded animate-pulse w-24" />
                                        <div className="h-5 bg-muted/50 rounded animate-pulse w-20" />
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-4">
                                    <div className="h-6 bg-muted/50 rounded animate-pulse w-28" />
                                    <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
                                </div>
                                <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
