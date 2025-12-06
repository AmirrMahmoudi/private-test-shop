
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { createHero, updateHero, fetchHeroById, type Hero } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeroFormProps {
    heroId?: string;
}

export default function HeroForm({ heroId }: HeroFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(!!heroId);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Hero>>({
        title: "",
        subtitle: "",
        image: "",
        button1Text: "",
        button1Link: "",
        button2Text: "",
        button2Link: "",
        isActive: true,
    });

    useEffect(() => {
        if (heroId) {
            loadHero(heroId);
        }
    }, [heroId]);

    async function loadHero(id: string) {
        try {
            setLoading(true);
            const data = await fetchHeroById(id);
            setFormData({
                title: data.title,
                subtitle: data.subtitle,
                image: data.image,
                button1Text: data.button1Text || "",
                button1Link: data.button1Link || "",
                button2Text: data.button2Text || "",
                button2Link: data.button2Link || "",
                isActive: data.isActive,
            });
        } catch (error) {
            toast.error("خطا در بارگذاری اطلاعات");
            router.push("/hero");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error("تصویر بنر الزامی است");
            return;
        }

        try {
            setSaving(true);
            if (heroId) {
                await updateHero(heroId, formData);
                toast.success("اسلاید با موفقیت ویرایش شد");
            } else {
                await createHero(formData as any);
                toast.success("اسلاید جدید با موفقیت ایجاد شد");
            }
            router.push("/hero");
        } catch (error) {
            console.error(error);
            toast.error("خطا در ذخیره اطلاعات");
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
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/hero">
                    <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        {heroId ? "ویرایش اسلاید" : "افزودن اسلاید جدید"}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-8">
                    {/* Image Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>تصویر بنر *</CardTitle>
                            <CardDescription>
                                تصویر اصلی اسلاید. پیشنهاد: کیفیت بالا و افقی (مثلاً 1920x800).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                value={formData.image || ""}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </CardContent>
                    </Card>

                    {/* Content Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>محتوای متنی</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">عنوان اصلی *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="مثال: جشنواره تابستانی"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">توضیحات زیر عنوان *</Label>
                                <Textarea
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="توضیحات کوتاه..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">نمایش در سایت (فعال)</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Buttons Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>دکمه‌ها</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            {/* Button 1 */}
                            <div className="space-y-4 border p-4 rounded-lg">
                                <h3 className="font-medium">دکمه اول (اصلی)</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="btn1-text">متن دکمه</Label>
                                    <Input
                                        id="btn1-text"
                                        value={formData.button1Text}
                                        onChange={(e) => setFormData({ ...formData, button1Text: e.target.value })}
                                        placeholder="مثال: خرید کنید"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="btn1-link">لینک مقصد</Label>
                                    <Input
                                        id="btn1-link"
                                        value={formData.button1Link}
                                        onChange={(e) => setFormData({ ...formData, button1Link: e.target.value })}
                                        placeholder="مثال: /products"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* Button 2 */}
                            <div className="space-y-4 border p-4 rounded-lg">
                                <h3 className="font-medium">دکمه دوم (فرعی)</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="btn2-text">متن دکمه</Label>
                                    <Input
                                        id="btn2-text"
                                        value={formData.button2Text}
                                        onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                                        placeholder="مثال: اطلاعات بیشتر"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="btn2-link">لینک مقصد</Label>
                                    <Input
                                        id="btn2-link"
                                        value={formData.button2Link}
                                        onChange={(e) => setFormData({ ...formData, button2Link: e.target.value })}
                                        placeholder="مثال: /about"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pb-8">
                        <Button size="lg" type="submit" disabled={saving} className="shadow-lg min-w-[150px]">
                            {saving ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    در حال ذخیره...
                                </>
                            ) : (
                                <>
                                    <Save className="ml-2 h-4 w-4" />
                                    ذخیره تغییرات
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
