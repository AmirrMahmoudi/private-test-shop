"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { fetchBrands, createBrand, updateBrand, deleteBrand, type Brand } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        logo: "",
        description: "",
        isActive: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadBrands();
    }, []);

    async function loadBrands() {
        try {
            setLoading(true);
            const data = await fetchBrands();
            setBrands(data);
        } catch (error) {
            toast.error("خطا در بارگذاری برندها");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

        if (!formData.name) {
            toast.error("نام برند الزامی است");
            return;
        }

        try {
            setSaving(true);

            if (editingBrand) {
                await updateBrand(editingBrand.id, formData);
                toast.success("برند با موفقیت ویرایش شد");
            } else {
                await createBrand(formData as any);
                toast.success("برند با موفقیت ایجاد شد");
            }

            setFormData({
                name: "",
                nameEn: "",
                logo: "",
                description: "",
                isActive: true,
            });
            setShowForm(false);
            setEditingBrand(null);
            loadBrands();
        } catch (error) {
            toast.error(editingBrand ? "خطا در ویرایش برند" : "خطا در ایجاد برند");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            nameEn: brand.nameEn || "",
            logo: brand.logo || "",
            description: brand.description || "",
            isActive: brand.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("آیا از حذف این برند اطمینان دارید؟")) {
            return;
        }

        try {
            await deleteBrand(id);
            toast.success("برند با موفقیت حذف شد");
            loadBrands();
        } catch (error) {
            toast.error("خطا در حذف برند");
            console.error(error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingBrand(null);
        setFormData({
            name: "",
            nameEn: "",
            logo: "",
            description: "",
            isActive: true,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">مدیریت برندها</h1>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن برند جدید
                    </Button>
                )}
            </div>

            {showForm && (
                <div className="bg-card p-6 rounded-lg border mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingBrand ? "ویرایش برند" : "برند جدید"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">نام برند (فارسی) *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="مثال: لورال"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nameEn">نام برند (انگلیسی)</Label>
                                <Input
                                    id="nameEn"
                                    name="nameEn"
                                    value={formData.nameEn}
                                    onChange={handleChange}
                                    placeholder="Example: L'Oreal"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>لوگوی برند</Label>
                            <ImageUpload
                                value={formData.logo}
                                onChange={(url) =>
                                    setFormData((prev) => ({ ...prev, logo: url }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">توضیحات</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="توضیحات برند..."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="isActive">فعال</Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                        در حال ذخیره...
                                    </>
                                ) : editingBrand ? (
                                    "ذخیره تغییرات"
                                ) : (
                                    "ایجاد برند"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                انصراف
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    لوگو
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    نام برند
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    نام انگلیسی
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    توضیحات
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    وضعیت
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {brands.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        هیچ برندی یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <td className="px-6 py-4">
                                            {brand.logo ? (
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    className="w-12 h-12 object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                                                    بدون لوگو
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {brand.name}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {brand.nameEn || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                                            {brand.description || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${brand.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {brand.isActive ? "فعال" : "غیرفعال"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(brand)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(brand.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
