"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { createOrder } from "@/lib/api";

export default function CheckoutForm() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        province: '',
        city: '',
        address: '',
        postalCode: '',
        paymentMethod: 'online'
    });

    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Create order object
            const orderData = {
                items: JSON.stringify(items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }))),
                total: totalPrice,
                status: "pending",
                shippingInfo: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    province: formData.province,
                    city: formData.city,
                    address: formData.address,
                    postalCode: formData.postalCode,
                    paymentMethod: formData.paymentMethod
                })
            };

            // Send order to backend
            const createdOrder = await createOrder(orderData);

            // Clear cart after successful order
            clearCart();
            toast.success(`سفارش شما با موفقیت ثبت شد! شماره سفارش: ${createdOrder.id.slice(0, 8)}`);
            router.push("/");
        } catch (error) {
            console.error("خطا در ثبت سفارش:", error);
            toast.error("متأسفانه در ثبت سفارش مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">تسویه حساب</h1>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {/* Shipping Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                اطلاعات ارسال
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">نام</Label>
                                    <Input
                                        id="firstName"
                                        required
                                        className="text-right"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">نام خانوادگی</Label>
                                    <Input
                                        id="lastName"
                                        required
                                        className="text-right"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">شماره تماس</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="09123456789"
                                    required
                                    className="text-right"
                                    dir="ltr"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="province">استان</Label>
                                    <Input
                                        id="province"
                                        required
                                        className="text-right"
                                        value={formData.province}
                                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">شهر</Label>
                                    <Input
                                        id="city"
                                        required
                                        className="text-right"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">آدرس پستی</Label>
                                <Textarea
                                    id="address"
                                    required
                                    className="text-right min-h-[80px]"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postalCode">کد پستی</Label>
                                <Input
                                    id="postalCode"
                                    required
                                    className="text-right"
                                    dir="ltr"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">روش پرداخت</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={formData.paymentMethod}
                                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                                className="gap-4"
                            >
                                <div className="flex items-center space-x-2 space-x-reverse border p-4 rounded-lg cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <RadioGroupItem value="online" id="online" />
                                    <Label htmlFor="online" className="flex-1 cursor-pointer font-normal">پرداخت اینترنتی (کلیه کارت‌های عضو شتاب)</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse border p-4 rounded-lg cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex-1 cursor-pointer font-normal">پرداخت در محل (فقط تهران)</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:w-80 xl:w-96 shrink-0">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">خلاصه سفارش</h3>

                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <div className="relative h-12 w-12 shrink-0 rounded overflow-hidden bg-muted">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="truncate font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">{item.quantity} عدد</p>
                                        </div>
                                        <span>{(item.price * item.quantity).toLocaleString('fa-IR')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">جمع کل</span>
                                    <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">هزینه ارسال</span>
                                    <span className="text-green-600">رایگان</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>مبلغ نهایی</span>
                                    <span className="text-primary">{totalPrice.toLocaleString('fa-IR')} تومان</span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                                {isProcessing ? "در حال پردازش..." : "ثبت سفارش و پرداخت"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </main>
    );
}
