export default function HeroSkeleton() {
    return (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />

            <div className="container px-4 md:px-6 mx-auto relative">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    {/* Title skeleton */}
                    <div className="space-y-4">
                        <div className="h-12 md:h-16 bg-muted/50 rounded animate-pulse w-full" />
                        <div className="h-12 md:h-16 bg-muted/50 rounded animate-pulse w-5/6 mx-auto" />
                    </div>

                    {/* Description skeleton */}
                    <div className="space-y-3">
                        <div className="h-6 bg-muted/50 rounded animate-pulse w-4/5 mx-auto" />
                        <div className="h-6 bg-muted/50 rounded animate-pulse w-3/4 mx-auto" />
                    </div>

                    {/* CTA Buttons skeleton */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-40" />
                        <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-40" />
                    </div>
                </div>
            </div>
        </section>
    );
}
