"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, Loader2, Plus, X, Sparkles } from "lucide-react";
import Link from "next/link";
import {
    createProduct,
    createBrand,
    fetchCategories,
    fetchBrands,
    fetchSubcategoriesByCategory,
    type Category,
    type Brand,
    type Subcategory
} from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [showBrandDialog, setShowBrandDialog] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [creatingBrand, setCreatingBrand] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        basePrice: "",
        categoryId: "",
        subcategoryId: "",
        brandId: "",
        description: "",
        isFeatured: false,
        rating: "",
        specifications: "",
    });

    // Load categories and brands
    useEffect(() => {
        async function loadData() {
            try {
                const [categoriesData, brandsData] = await Promise.all([
                    fetchCategories(),
                    fetchBrands()
                ]);
                setCategories(categoriesData);
                setBrands(brandsData);
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("خطا در بارگذاری داده‌ها");
            }
        }

        loadData();
    }, []);

    // Load subcategories when category changes
    useEffect(() => {
        async function loadSubcategories() {
            if (!formData.categoryId) {
                setSubcategories([]);
                setFormData(prev => ({ ...prev, subcategoryId: "" }));
                return;
            }

            try {
                const data = await fetchSubcategoriesByCategory(formData.categoryId);
                setSubcategories(data);
                // Reset subcategory if it doesn't belong to new category
                if (formData.subcategoryId && !data.find(s => s.id === formData.subcategoryId)) {
                    setFormData(prev => ({ ...prev, subcategoryId: "" }));
                }
            } catch (error) {
                console.error("Failed to load subcategories:", error);
                toast.error("خطا در بارگذاری زیردسته‌ها");
            }
        }

        loadSubcategories();
    }, [formData.categoryId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => {
            const next = {
                ...prev,
                [name]:
                    type === "checkbox"
                        ? (e.target as HTMLInputElement).checked
                        : value,
            };

            // Generate slug from name if name changes and slug is empty
            if (name === "name" && !prev.slug) {
                next.slug = value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                    .slice(0, 60);
            }

            return next;
        });
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleCreateBrand = async () => {
        if (!newBrandName.trim()) {
            toast.error("نام برند الزامی است");
            return;
        }

        try {
            setCreatingBrand(true);
            const newBrand = await createBrand({
                name: newBrandName.trim(),
                isActive: true,
            } as any);

            // Reload brands and select the new one
            const updatedBrands = await fetchBrands();
            setBrands(updatedBrands);
            setFormData(prev => ({ ...prev, brandId: newBrand.id }));

            toast.success("برند جدید با موفقیت ایجاد شد");
            setShowBrandDialog(false);
            setNewBrandName("");
        } catch (error) {
            toast.error("خطا در ایجاد برند");
            console.error(error);
        } finally {
            setCreatingBrand(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.basePrice || !formData.categoryId) {
            toast.error("لطفاً فیلدهای ستاره‌دار را کامل کنید (نام، دسته‌بندی، قیمت پایه)");
            return;
        }

        if (images.length === 0) {
            toast.error("لطفاً حداقل یک تصویر اضافه کنید");
            return;
        }

        try {
            setLoading(true);

            // Parse specifications if provided
            let specifications = null;
            if (formData.specifications) {
                try {
                    specifications = JSON.parse(formData.specifications);
                } catch {
                    toast.error("فرمت specifications نامعتبر است. باید JSON معتبر باشد.");
                    return;
                }
            }

            await createProduct({
                name: formData.name,
                slug: formData.slug || undefined,
                basePrice: parseInt(formData.basePrice),
                categoryId: formData.categoryId,
                subcategoryId: formData.subcategoryId || undefined,
                brandId: formData.brandId || undefined,
                description: formData.description || undefined,
                images: images,
                tags: tags.length > 0 ? tags : undefined as any,
                specifications: specifications,
                isFeatured: formData.isFeatured,
                rating: formData.rating ? parseFloat(formData.rating) : undefined,
            } as any);

            toast.success("محصول با موفقیت ایجاد شد");
            router.push("/products");
        } catch (error) {
            toast.error("خطا در ایجاد محصول");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">افزودن محصول جدید</h1>
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
                                اگر خالی بگذارید به‌صورت خودکار از روی نام ساخته می‌شود.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">دسته‌بندی *</Label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
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
                            <Label htmlFor="subcategoryId">زیر دسته – اختیاری</Label>
                            <select
                                id="subcategoryId"
                                name="subcategoryId"
                                value={formData.subcategoryId}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={!formData.categoryId || subcategories.length === 0}
                            >
                                <option value="">انتخاب زیردسته</option>
                                {subcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            {formData.categoryId && subcategories.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    این دسته‌بندی زیردسته ندارد
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="brandId">برند – اختیاری</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowBrandDialog(true)}
                                    className="h-7 text-xs"
                                >
                                    <Sparkles className="w-3 h-3 ml-1" />
                                    برند جدید
                                </Button>
                            </div>
                            <select
                                id="brandId"
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
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
                    <h2 className="text-xl font-semibold mb-4">قیمت و تصاویر</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="basePrice">قیمت پایه (تومان) *</Label>
                            <Input
                                id="basePrice"
                                name="basePrice"
                                type="number"
                                value={formData.basePrice}
                                onChange={handleChange}
                                placeholder="450000"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                حداقل قیمت محصول (قیمت واریانت‌ها می‌تواند متفاوت باشد)
                            </p>
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

                    <div className="space-y-2">
                        <Label>تصاویر محصول *</Label>
                        <div className="space-y-2">
                            {images.map((image, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input value={image} readOnly />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <ImageUpload
                                value=""
                                onChange={(url) => {
                                    if (url && !images.includes(url)) {
                                        setImages([...images, url]);
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            حداقل یک تصویر اضافه کنید
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">تگ‌ها و ویژگی‌ها</h2>

                    <div className="space-y-2">
                        <Label htmlFor="tags">تگ‌ها</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="مثال: بدون سولفات"
                            />
                            <Button type="button" onClick={addTag} variant="outline">
                                <Plus className="h-4 w-4 ml-2" />
                                افزودن
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specifications">ویژگی‌ها (JSON)</Label>
                        <Textarea
                            id="specifications"
                            name="specifications"
                            value={formData.specifications}
                            onChange={handleChange}
                            placeholder='{"حجم": "500ml", "وزن": "200g"}'
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            فرمت JSON: {"{"}"کلید": "مقدار"{"}"}
                        </p>
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
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                در حال ایجاد...
                            </>
                        ) : (
                            "ایجاد محصول"
                        )}
                    </Button>
                    <Link href="/products">
                        <Button type="button" variant="outline">
                            انصراف
                        </Button>
                    </Link>
                </div>
            </form>

            {/* Quick Brand Creation Dialog */}
            {showBrandDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg border max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">افزودن برند جدید</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newBrandName">نام برند (فارسی) *</Label>
                                <Input
                                    id="newBrandName"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    placeholder="مثال: لورال"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateBrand();
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={handleCreateBrand}
                                    disabled={creatingBrand}
                                    className="flex-1"
                                >
                                    {creatingBrand ? (
                                        <>
                                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                            در حال ایجاد...
                                        </>
                                    ) : (
                                        "ایجاد برند"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowBrandDialog(false);
                                        setNewBrandName("");
                                    }}
                                >
                                    انصراف
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
