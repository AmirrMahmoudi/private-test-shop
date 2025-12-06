"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchProductById, updateProduct, fetchCategories, fetchBrands, type Category, type Brand } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        image: "",
        category: "",
        subcategory: "",
        brand: "",
        description: "",
        stock: "",
        isFeatured: false,
        rating: "",
        tags: "",
    });

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, [id]);

    async function loadProduct() {
        try {
            setLoading(true);
            const product = await fetchProductById(id);

            // Handle the new schema where we use basePrice instead of price
            const productPrice = (product as any).price || (product as any).basePrice || 0;
            const productImage = product.image || (Array.isArray((product as any).images) && (product as any).images.length > 0 ? (product as any).images[0] : "");

            // Category and subcategory might be objects or IDs
            const categoryValue = typeof product.category === 'object' ? (product.category as any).id : product.category;
            const subcategoryValue = typeof product.subcategory === 'object' ? (product.subcategory as any).id : (product.subcategoryId || "");

            // Brand might be an object or string
            const brandValue = product.brand ? (typeof product.brand === 'object' ? (product.brand as any).id : product.brand) : "";

            // Tags might be array or string
            const tagsValue = Array.isArray((product as any).tags)
                ? JSON.stringify((product as any).tags)
                : (product as any).tags || "";

            setFormData({
                name: product.name,
                slug: (product as any).slug || "",
                price: productPrice.toString(),
                image: productImage,
                category: categoryValue,
                subcategory: subcategoryValue,
                brand: brandValue,
                description: product.description || "",
                stock: product.stock?.toString() || "0",
                isFeatured: product.isFeatured || false,
                rating: product.rating?.toString() || "",
                tags: tagsValue,
            });
        } catch (error) {
            toast.error("خطا در بارگذاری اطلاعات محصول");
            console.error(error);
            router.push("/products");
        } finally {
            setLoading(false);
        }
    }

    async function loadCategories() {
        try {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);

            const brandsData = await fetchBrands();
            setBrands(brandsData);
        } catch (error) {
            console.error("Failed to load categories or brands:", error);
            toast.error("خطا در بارگذاری دسته‌بندی‌ها و برندها");
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category || !formData.subcategory) {
            toast.error("لطفاً فیلدهای ستاره‌دار را کامل کنید (نام، دسته‌بندی، زیر دسته، قیمت)");
            return;
        }

        try {
            setSaving(true);

            // Prepare tags - if it's a JSON string, parse it, otherwise keep as is
            let tagsData: string[] | null = null;
            if (formData.tags) {
                try {
                    const parsed = JSON.parse(formData.tags);
                    tagsData = Array.isArray(parsed) ? parsed : [formData.tags];
                } catch {
                    tagsData = [formData.tags];
                }
            }

            // Prepare images array
            const imagesArray = formData.image ? [formData.image] : [];

            await updateProduct(id, {
                name: formData.name,
                slug: formData.slug || undefined,
                basePrice: parseInt(formData.price),
                images: imagesArray,
                category: formData.category as any, // API expects categoryId
                categoryId: formData.category,
                subcategoryId: formData.subcategory,
                brandId: formData.brand || undefined, // Changed from 'brand' to 'brandId'
                description: formData.description || undefined,
                stock: parseInt(formData.stock) || 0,
                isFeatured: formData.isFeatured,
                rating: formData.rating ? parseFloat(formData.rating) : undefined,
                tags: tagsData as any,
            });

            toast.success("محصول با موفقیت ویرایش شد");
            router.push("/products");
        } catch (error) {
            toast.error("خطا در ویرایش محصول");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">ویرایش محصول</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card p-6 rounded-lg border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">اطلاعات اصلی</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">نام محصول *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="مثال: کرم مرطوب‌کننده"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">روت محصول (slug) – اختیاری</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="مثال: luxury-perfume"
                            />
                            <p className="text-xs text-muted-foreground">
                                این مقدار در آدرس محصول استفاده می‌شود، مثلاً:
                                <code className="mx-1">/product/luxury-perfume</code>
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">برند</Label>
                            <select
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        brand: e.target.value,
                                    }))
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">انتخاب برند</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">دسته‌بندی *</Label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="">انتخاب دسته‌بندی</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subcategory">زیر دسته *</Label>
                            <select
                                id="subcategory"
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="">انتخاب زیر دسته</option>
                                {categories
                                    .find(c => c.id === formData.category)
                                    ?.subcategories?.map((sub) => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="توضیحات کامل محصول..."
                            rows={4}
                        />
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">قیمت و موجودی</h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">قیمت (تومان) *</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="450000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">موجودی</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="25"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">امتیاز (۰-۵)</Label>
                            <Input
                                id="rating"
                                name="rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="4.5"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">تصویر و تنظیمات</h2>

                    <div className="space-y-2">
                        <Label>تصویر محصول</Label>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    image: url,
                                }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">برچسب‌ها (JSON)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder='["مرطوب کننده", "روزانه"]'
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="isFeatured"
                            name="isFeatured"
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="isFeatured">محصول ویژه</Label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="flex-1">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                در حال ذخیره...
                            </>
                        ) : (
                            "ذخیره تغییرات"
                        )}
                    </Button>
                    <Link href="/products">
                        <Button type="button" variant="outline">
                            انصراف
                        </Button>
                    </Link>
                </div>
            </form >
        </div >
    );
}
