"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        subcategories: "", // We'll handle this as comma separated string for simplicity or JSON
        routeKey: "", // شناسه روت (id) که در URL استفاده می‌شود، مثل perfume
    });

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories:", error);
            toast.error("خطا در بارگذاری دسته‌بندی‌ها");
        } finally {
            setLoading(false);
        }
    }

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            // Parse subcategories
            let subs = "";
            if (Array.isArray(category.subcategories)) {
                subs = category.subcategories.map((s: any) => typeof s === 'string' ? s : s.name).join(", ");
            } else if (typeof category.subcategories === 'string') {
                try {
                    const parsed = JSON.parse(category.subcategories);
                    if (Array.isArray(parsed)) subs = parsed.join(", ");
                    else subs = category.subcategories;
                } catch (e) {
                    subs = category.subcategories;
                }
            }

            setFormData({
                name: category.name,
                image: (category as any).image || "", // Type assertion as image might be missing in type def if not updated
                subcategories: subs,
                routeKey: category.id, // در ویرایش هم قابل تغییر است و به عنوان id به بک‌اند ارسال می‌شود
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                image: "",
                subcategories: "",
                routeKey: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);

            // Convert subcategories string back to JSON array string
            const subArray = formData.subcategories.split(",").map(s => s.trim()).filter(Boolean);
            const subJson = JSON.stringify(subArray);

            const dataToSave: any = {
                name: formData.name,
                image: formData.image,
                subcategories: subJson,
            };

            if (editingCategory) {
                // در ویرایش، اگر routeKey عوض شده باشد، آن را به عنوان id جدید می‌فرستیم
                if (formData.routeKey.trim() && formData.routeKey.trim() !== editingCategory.id) {
                    dataToSave.id = formData.routeKey.trim();
                }
                await updateCategory(editingCategory.id, dataToSave);
                toast.success("دسته‌بندی با موفقیت ویرایش شد");
            } else {
                // در ایجاد دسته‌بندی جدید، اگر کاربر routeKey وارد کرده باشد، به عنوان id ذخیره می‌کنیم
                if (formData.routeKey.trim()) {
                    dataToSave.id = formData.routeKey.trim();
                }
                await createCategory(dataToSave);
                toast.success("دسته‌بندی جدید ایجاد شد");
            }

            setIsDialogOpen(false);
            loadCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
            toast.error("خطا در ذخیره دسته‌بندی");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

        try {
            await deleteCategory(id);
            toast.success("دسته‌بندی حذف شد");
            loadCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("خطا در حذف دسته‌بندی");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">مدیریت دسته‌بندی‌ها</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن دسته‌بندی
                </Button>
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">تصویر</TableHead>
                            <TableHead>نام دسته‌بندی</TableHead>
                            <TableHead>زیرمجموعه‌ها</TableHead>
                            <TableHead className="text-left">عملیات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    هیچ دسته‌بندی یافت نشد.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => {
                                let subCount = 0;
                                if (Array.isArray(category.subcategories)) {
                                    subCount = category.subcategories.length;
                                }

                                return (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                                                {(category as any).image ? (
                                                    <Image
                                                        src={(category as any).image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{subCount} زیرمجموعه</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label>تصویر دسته‌بندی</Label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">نام دسته‌بندی</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="مثال: آرایشی"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subcategories">زیرمجموعه‌ها (با کاما جدا کنید)</Label>
                            <Input
                                id="subcategories"
                                value={formData.subcategories}
                                onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                                placeholder="مثال: رژ لب، کرم پودر، ریمل"
                            />
                        </div>

                        {/* فقط در ایجاد دسته‌بندی جدید اجازه تعیین route/id را می‌دهیم */}
                        {!editingCategory ? (
                            <div className="space-y-2">
                                <Label htmlFor="routeKey">شناسه روت (اختیاری، انگلیسی بدون فاصله)</Label>
                                <Input
                                    id="routeKey"
                                    value={formData.routeKey}
                                    onChange={(e) => setFormData({ ...formData, routeKey: e.target.value })}
                                    placeholder="مثال: perfume"
                                />
                                <p className="text-xs text-muted-foreground">
                                    این مقدار در URL سایت اصلی استفاده می‌شود؛ مثلاً اگر بنویسید <code>perfume</code>، لینک دسته می‌شود
                                    <code className="mx-1">/products/perfume</code>.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <span>شناسه روت فعلی: </span>
                                <code>{formData.routeKey}</code>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                                انصراف
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "در حال ذخیره..." : "ذخیره"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
