"use client";

import { useEffect, useState } from "react";
import { Package, Clock, Truck, CheckCircle, Loader2, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    fetchOrders,
    updateOrder,
    deleteOrder,
    Order
} from "@/lib/api";

const statusConfig = {
    pending: {
        label: "در انتظار",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock
    },
    processing: {
        label: "در حال پردازش",
        color: "bg-blue-100 text-blue-800",
        icon: Package
    },
    shipped: {
        label: "ارسال شده",
        color: "bg-purple-100 text-purple-800",
        icon: Truck
    },
    delivered: {
        label: "تحویل شده",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            setLoading(true);
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            toast.error("خطا در بارگذاری سفارشات");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            setUpdatingId(id);
            await updateOrder(id, { status: newStatus });
            toast.success("وضعیت سفارش بروزرسانی شد");
            loadOrders();
        } catch (error) {
            toast.error("خطا در بروزرسانی وضعیت");
            console.error(error);
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("آیا از حذف این سفارش مطمئن هستید؟")) {
            return;
        }

        try {
            setDeletingId(id);
            await deleteOrder(id);
            toast.success("سفارش با موفقیت حذف شد");
            loadOrders();
        } catch (error) {
            toast.error("خطا در حذف سفارش");
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
                <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">کل سفارشات</p>
                    <p className="text-3xl font-bold mt-2">{orders.length}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">در انتظار</p>
                    <p className="text-3xl font-bold mt-2 text-yellow-600">
                        {orders.filter(o => o.status === "pending").length}
                    </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">در حال پردازش</p>
                    <p className="text-3xl font-bold mt-2 text-blue-600">
                        {orders.filter(o => o.status === "processing").length}
                    </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <p className="text-muted-foreground text-sm">تحویل شده</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                        {orders.filter(o => o.status === "delivered").length}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr className="text-right">
                                <th className="px-6 py-4 text-sm font-medium">شناسه</th>
                                <th className="px-6 py-4 text-sm font-medium">تعداد آیتم</th>
                                <th className="px-6 py-4 text-sm font-medium">مبلغ کل</th>
                                <th className="px-6 py-4 text-sm font-medium">وضعیت</th>
                                <th className="px-6 py-4 text-sm font-medium">تاریخ</th>
                                <th className="px-6 py-4 text-sm font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                const StatusIcon = config.icon;

                                return (
                                    <tr key={order.id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm">
                                                {order.orderNumber || order.id.slice(0, 8) + '...'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.items?.length || 0} محصول
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {order.total.toLocaleString('fa-IR')} تومان
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {config.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>

                                                <select
                                                    className="text-sm border rounded px-2 py-1 bg-background"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingId === order.id}
                                                >
                                                    <option value="pending">در انتظار</option>
                                                    <option value="processing">در حال پردازش</option>
                                                    <option value="shipped">ارسال شده</option>
                                                    <option value="delivered">تحویل شده</option>
                                                </select>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(order.id)}
                                                    disabled={deletingId === order.id}
                                                >
                                                    {deletingId === order.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">هیچ سفارشی وجود ندارد</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">جزئیات سفارش</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">شماره سفارش</p>
                                    <p className="font-mono font-bold">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">وضعیت</p>
                                    <p className="font-medium">{statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">نام مشتری</p>
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">شماره تماس</p>
                                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                                </div>
                            </div>

                            {selectedOrder.customerEmail && (
                                <div>
                                    <p className="text-sm text-muted-foreground">ایمیل</p>
                                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">آیتم‌ها</p>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-muted p-3 rounded">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.productName}</p>
                                                {item.variantName && (
                                                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                                                )}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {item.quantity} عدد × {item.price.toLocaleString('fa-IR')} = {item.total.toLocaleString('fa-IR')} تومان
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">جمع محصولات:</span>
                                    <span className="font-medium">{selectedOrder.subtotal.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                {selectedOrder.shippingCost > 0 && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-muted-foreground">هزینه ارسال:</span>
                                        <span className="font-medium">{selectedOrder.shippingCost.toLocaleString('fa-IR')} تومان</span>
                                    </div>
                                )}
                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between mb-2 text-green-600">
                                        <span>تخفیف:</span>
                                        <span className="font-medium">- {selectedOrder.discount.toLocaleString('fa-IR')} تومان</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>مبلغ نهایی:</span>
                                    <span className="text-primary">{selectedOrder.total.toLocaleString('fa-IR')} تومان</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">تاریخ ثبت</p>
                                <p>{new Date(selectedOrder.createdAt).toLocaleString('fa-IR')}</p>
                            </div>

                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">یادداشت</p>
                                    <p className="text-sm bg-muted p-2 rounded">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                        <Button className="w-full mt-6" onClick={() => setSelectedOrder(null)}>
                            بستن
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
