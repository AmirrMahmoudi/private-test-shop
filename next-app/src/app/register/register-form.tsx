"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate registration
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("حساب کاربری با موفقیت ساخته شد");
        setIsLoading(false);
        router.push("/");
    };

    return (
        <main className="container mx-auto px-4 py-20 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">ثبت نام در بیوتی‌شاپ</CardTitle>
                    <CardDescription>
                        برای ساخت حساب کاربری اطلاعات زیر را وارد کنید
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="name">نام و نام خانوادگی</Label>
                            <Input
                                id="name"
                                placeholder="مثال: علی محمدی"
                                className="text-right"
                                required
                            />
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="phone">شماره موبایل</Label>
                            <Input
                                id="phone"
                                placeholder="09123456789"
                                className="text-left"
                                dir="ltr"
                                required
                            />
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="password">رمز عبور</Label>
                            <Input
                                id="password"
                                type="password"
                                className="text-left"
                                dir="ltr"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "در حال ثبت نام..." : "ثبت نام"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            قبلاً ثبت نام کرده‌اید؟{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                وارد شوید
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
