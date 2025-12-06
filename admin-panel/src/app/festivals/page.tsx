
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { fetchFestivals, deleteFestival, type Festival } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function FestivalsPage() {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFestivals();
    }, []);

    async function loadFestivals() {
        try {
            setLoading(true);
            const data = await fetchFestivals();
            setFestivals(data);
        } catch (error) {
            toast.error("خطا در بارگذاری جشنواره‌ها");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("آیا از حذف این جشنواره اطمینان دارید؟")) {
            return;
        }

        try {
            await deleteFestival(id);
            toast.success("جشنواره با موفقیت حذف شد");
            loadFestivals();
        } catch (error) {
            toast.error("خطا در حذف جشنواره");
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
                <h1 className="text-3xl font-bold">مدیریت جشنواره‌ها</h1>
                <Link href="/festivals/new">
                    <Button>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن جشنواره جدید
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
                                <th className="px-6 py-3 text-right text-sm font-semibold">تاریخ شروع/پایان</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">وضعیت</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {festivals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        هیچ جشنواره‌ای یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                festivals.map((festival) => (
                                    <tr key={festival.id}>
                                        <td className="px-6 py-4">
                                            <div className="relative w-24 h-12 rounded overflow-hidden bg-muted">
                                                <Image
                                                    src={festival.image}
                                                    alt={festival.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{festival.title}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {festival.startDate ? new Date(festival.startDate).toLocaleDateString('fa-IR') : '---'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-red-400" />
                                                    {festival.endDate ? new Date(festival.endDate).toLocaleDateString('fa-IR') : '---'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${festival.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {festival.isActive ? "فعال" : "غیرفعال"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link href={`/festivals/${festival.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(festival.id)}
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
