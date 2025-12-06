
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { fetchAllHeroes, deleteHero, type Hero } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function HeroListPage() {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHeroes();
    }, []);

    async function loadHeroes() {
        try {
            setLoading(true);
            const data = await fetchAllHeroes();
            setHeroes(data);
        } catch (error) {
            toast.error("خطا در بارگذاری لیست بنرها");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("آیا از حذف این اسلاید اطمینان دارید؟")) {
            return;
        }

        try {
            await deleteHero(id);
            toast.success("اسلاید با موفقیت حذف شد");
            loadHeroes();
        } catch (error) {
            toast.error("خطا در حذف اسلاید");
            console.error(error);
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
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">مدیریت بنر اصلی (Hero)</h1>
                    <p className="text-muted-foreground mt-2">
                        لیست اسلایدهای نمایش داده شده در صفحه اصلی
                    </p>
                </div>
                <Link href="/hero/new">
                    <Button>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن اسلاید جدید
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-right text-sm font-semibold">تصویر</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">عنوان</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">توضیحات</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">وضعیت</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {heroes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        هیچ اسلایدی یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                heroes.map((hero) => (
                                    <tr key={hero.id}>
                                        <td className="px-6 py-4">
                                            <div className="relative w-24 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                                                {hero.image ? (
                                                    <Image
                                                        src={hero.image}
                                                        alt={hero.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{hero.title}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                                            {hero.subtitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${hero.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {hero.isActive ? "فعال" : "غیرفعال"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link href={`/hero/${hero.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(hero.id)}
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
