"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("با موفقیت وارد شدید");
        setIsLoading(false);
        router.push("/");
    };

    return (
        <main className="container mx-auto px-4 py-20 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">ورود به حساب کاربری</CardTitle>
                    <CardDescription>
                        برای دسترسی به حساب کاربری خود شماره موبایل را وارد کنید
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "در حال ورود..." : "ورود"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            حساب کاربری ندارید؟{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                ثبت نام کنید
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
