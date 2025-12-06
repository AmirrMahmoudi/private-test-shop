"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartContent() {
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="bg-muted/30 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    به نظر می‌رسد هنوز محصولی را انتخاب نکرده‌اید. از محصولات متنوع ما دیدن کنید.
                </p>
                <Link href="/products">
                    <Button size="lg">مشاهده محصولات</Button>
                </Link>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 w-full text-right">
                                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{item.subcategory}</p>
                                    <p className="font-medium text-primary">
                                        {item.price.toLocaleString('fa-IR')} تومان
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm font-medium">
                                            {item.quantity.toLocaleString('fa-IR')}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-80 xl:w-96 shrink-0">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">خلاصه سفارش</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">تعداد اقلام</span>
                                    <span>{totalItems.toLocaleString('fa-IR')} عدد</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">مجموع قیمت</span>
                                    <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">هزینه ارسال</span>
                                    <span className="text-green-600">رایگان</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>مبلغ قابل پرداخت</span>
                                    <span className="text-primary">{totalPrice.toLocaleString('fa-IR')} تومان</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button className="w-full" size="lg">
                                    ادامه جهت تسویه حساب
                                </Button>
                            </Link>

                            <Link href="/products" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4">
                                بازگشت به خرید <ArrowRight className="h-4 w-4 rotate-180" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
