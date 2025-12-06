"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    fetchProducts,
    deleteProduct,
    Product
} from "@/lib/api";
import Image from "next/image";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error("خطا در بارگذاری محصولات");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`آیا از حذف "${name}" مطمئن هستید؟`)) {
            return;
        }

        try {
            setDeletingId(id);
            await deleteProduct(id);
            toast.success("محصول با موفقیت حذف شد");
            loadProducts();
        } catch (error) {
            toast.error("خطا در حذف محصول");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
                <Link href="/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        افزودن محصول
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">کل محصولات</p>
                    <p className="text-3xl font-bold mt-2">{products.length}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">محصولات ویژه</p>
                    <p className="text-3xl font-bold mt-2">
                        {products.filter(p => p.isFeatured).length}
                    </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">موجود در انبار</p>
                    <p className="text-3xl font-bold mt-2">
                        {products.reduce((sum, p) => sum + p.stock, 0)}
                    </p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr className="text-right">
                                <th className="px-6 py-4 text-sm font-medium">تصویر</th>
                                <th className="px-6 py-4 text-sm font-medium">نام محصول</th>
                                <th className="px-6 py-4 text-sm font-medium">دسته‌بندی</th>
                                <th className="px-6 py-4 text-sm font-medium">قیمت</th>
                                <th className="px-6 py-4 text-sm font-medium">موجودی</th>
                                <th className="px-6 py-4 text-sm font-medium">وضعیت</th>
                                <th className="px-6 py-4 text-sm font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                            {(product.image || (product.images && product.images.length > 0)) && (
                                                <Image
                                                    src={product.image || (product.images && product.images[0]) || ''}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{product.name}</span>
                                            {product.brand && (
                                                <span className="text-sm text-muted-foreground">
                                                    {typeof product.brand === 'string' ? product.brand : product.brand.name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {typeof product.category === 'string' 
                                            ? product.category 
                                            : (product.category?.name || product.categoryId)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {product.price.toLocaleString('fa-IR')} تومان
                                        {product.hasVariants && (
                                            <span className="text-xs text-muted-foreground block">
                                                از {product.minPrice?.toLocaleString('fa-IR')} تومان
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.isFeatured && (
                                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                                ویژه
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/products/${product.id}/edit`}>
                                                <Button size="sm" variant="ghost">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deletingId === product.id}
                                            >
                                                {deletingId === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">هیچ محصولی وجود ندارد</p>
                        <Link href="/products/new">
                            <Button className="mt-4">افزودن اولین محصول</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
