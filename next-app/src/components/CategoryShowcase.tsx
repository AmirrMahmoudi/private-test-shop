
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Server-side data fetching
async function getCategories() {
  try {
    const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

    const res = await fetch(`${baseUrl}/categories`, {
      next: { revalidate: 3600 } // ISR - revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return res.json();
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function CategoryShowcase() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/20" id="categories">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            دسته‌بندی‌ها
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-lg">
            محصولات خود را بر اساس دسته‌بندی مورد نظر پیدا کنید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: any) => {
            const subcategories = typeof category.subcategories === 'string'
              ? JSON.parse(category.subcategories)
              : category.subcategories || [];

            return (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || '/placeholder-category.jpg'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1 text-right">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200 text-right">
                        {subcategories.length} زیردسته
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <ArrowLeft className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
                      <span className="text-sm text-muted-foreground">
                        مشاهده محصولات
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}