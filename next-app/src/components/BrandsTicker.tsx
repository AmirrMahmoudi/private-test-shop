import { fetchBrands } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function BrandsTicker() {
    const brands = await fetchBrands();

    // If no brands or few brands, don't show or show static
    if (!brands || brands.length === 0) return null;

    // Duplicate list for infinite scroll effect if needed
    const displayBrands = [...brands, ...brands, ...brands];

    return (
        <section className="py-12 overflow-hidden bg-background">
            <div className="container mx-auto px-4 mb-8">
                <h2 className="text-2xl font-bold text-center mb-2">برندهای محبوب</h2>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll gap-12 w-max px-4">
                    {displayBrands.map((brand, index) => (
                        <Link
                            key={`${brand.id}-${index}`}
                            href={`/products/brand/${brand.id}`}
                            className="flex flex-col items-center justify-center min-w-[100px] group opacity-70 hover:opacity-100 transition-opacity"
                        >
                            {brand.logo ? (
                                <div className="relative w-20 h-20 mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full mb-2 text-xs font-bold text-muted-foreground">
                                    {brand.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm font-medium">{brand.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
