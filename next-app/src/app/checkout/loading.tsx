import NavbarServer from "@/components/NavbarServer";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <NavbarServer />

            <div className="container px-4 md:px-6 mx-auto py-8">
                <div className="mb-8">
                    <div className="h-10 bg-muted/50 rounded animate-pulse w-56" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Info */}
                        <div className="border rounded-lg p-6 space-y-4">
                            <div className="h-7 bg-muted/50 rounded animate-pulse w-40" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-muted/50 rounded animate-pulse w-24" />
                                        <div className="h-10 bg-muted/50 rounded animate-pulse w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="border rounded-lg p-6 space-y-4">
                            <div className="h-7 bg-muted/50 rounded animate-pulse w-40" />
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
                                        <div className="h-10 bg-muted/50 rounded animate-pulse w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 space-y-4 sticky top-24">
                            <div className="h-7 bg-muted/50 rounded animate-pulse w-32" />

                            <div className="space-y-3">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="flex gap-3 pb-3 border-b">
                                        <div className="w-16 h-16 bg-muted/50 rounded animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                                            <div className="h-4 bg-muted/50 rounded animate-pulse w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-5 bg-muted/50 rounded animate-pulse w-24" />
                                        <div className="h-5 bg-muted/50 rounded animate-pulse w-20" />
                                    </div>
                                ))}
                            </div>

                            <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
