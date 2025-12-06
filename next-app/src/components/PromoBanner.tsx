import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { fetchActiveFestival } from "@/lib/api";

export default async function PromoBanner() {
    const festival = await fetchActiveFestival();

    // If no active festival, don't render anything
    if (!festival) return null;

    return (
        <section className="py-12 container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-primary/5 border">
                <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                    <div className="space-y-6 text-center md:text-right z-10 order-2 md:order-1">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">
                            {festival.title}
                        </h2>
                        {festival.description && (
                            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
                                {festival.description}
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            {festival.link && (
                                <Link href={festival.link}>
                                    <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                                        {festival.buttonText || "مشاهده جزئیات"}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden order-1 md:order-2">
                        <Image
                            src={festival.image}
                            alt={festival.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50" />
            </div>
        </section>
    );
}
