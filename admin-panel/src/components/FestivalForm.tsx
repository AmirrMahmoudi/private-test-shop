
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { createFestival, updateFestival, fetchFestivalById, type Festival } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FestivalFormProps {
    festivalId?: string;
}

export default function FestivalForm({ festivalId }: FestivalFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(!!festivalId);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        startDate: "",
        endDate: "",
        buttonText: "خرید با تخفیف",
        link: "/products?tag=sale",
        isActive: true,
    });

    useEffect(() => {
        if (festivalId) {
            loadFestival(festivalId);
        }
    }, [festivalId]);

    async function loadFestival(id: string) {
        try {
            setLoading(true);
            const data = await fetchFestivalById(id);
            setFormData({
                title: data.title,
                description: data.description || "",
                image: data.image,
                startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
                endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
                buttonText: data.buttonText || "",
                link: data.link || "",
                isActive: data.isActive,
            });
        } catch (error) {
            toast.error("خطا در بارگذاری اطلاعات جشنواره");
            console.error(error);
            router.push("/festivals");
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

        if (!formData.title || !formData.image) {
            toast.error("عنوان و تصویر الزامی هستند");
            return;
        }

        try {
            setSaving(true);
            if (festivalId) {
                await updateFestival(festivalId, formData);
                toast.success("جشنواره با موفقیت ویرایش شد");
            } else {
                await createFestival(formData);
                toast.success("جشنواره با موفقیت ایجاد شد");
            }
            router.push("/festivals");
        } catch (error) {
            toast.error("خطا در ذخیره اطلاعات");
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
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/festivals">
                    <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">
                    {festivalId ? "ویرایش جشنواره" : "افزودن جشنواره جدید"}
                </h1>
            </div>

            <div className="bg-card p-6 rounded-lg border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>تصویر بنر *</Label>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        />
                        <p className="text-xs text-muted-foreground">
                            پیشنهاد: تصویر با نسبت عرضی کشیده (مثلاً ۱۲۰۰x۴۰۰ پیکسل) برای نمایش بهتر.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">عنوان *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="مثال: جشنواره تابستانی"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isActive">وضعیت</Label>
                            <div className="flex items-center gap-2 h-10">
                                <input
                                    id="isActive"
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">فعال</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startDate">تاریخ شروع</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">تاریخ پایان</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="buttonText">متن دکمه</Label>
                            <Input
                                id="buttonText"
                                name="buttonText"
                                value={formData.buttonText}
                                onChange={handleChange}
                                placeholder="مثال: خرید با تخفیف"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">لینک مقصد</Label>
                            <Input
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="مثال: /products?tag=sale"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="توضیحات کوتاه که زیر عنوان نمایش داده می‌شود..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="submit" disabled={saving} className="min-w-[120px]">
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    ذخیره...
                                </>
                            ) : (
                                "ذخیره تغییرات"
                            )}
                        </Button>
                        <Link href="/festivals">
                            <Button type="button" variant="outline">
                                انصراف
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
