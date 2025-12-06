"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="p-6 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">تنظیمات</h1>

            <div className="space-y-6">
                {/* Appearance Settings */}
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">ظاهر برنامه</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">تم برنامه</Label>
                                <p className="text-sm text-muted-foreground">
                                    حالت تاریک یا روشن را انتخاب کنید
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                                <Button
                                    variant={theme === "light" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setTheme("light")}
                                    className="gap-2"
                                >
                                    <Sun className="w-4 h-4" />
                                    روشن
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setTheme("dark")}
                                    className="gap-2"
                                >
                                    <Moon className="w-4 h-4" />
                                    تاریک
                                </Button>
                                <Button
                                    variant={theme === "system" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setTheme("system")}
                                    className="gap-2"
                                >
                                    <Monitor className="w-4 h-4" />
                                    سیستم
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Settings (Placeholder) */}
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">تنظیمات عمومی</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">اعلان‌ها</Label>
                                <p className="text-sm text-muted-foreground">
                                    دریافت اعلان‌های سفارش جدید
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">حالت تعمیرات</Label>
                                <p className="text-sm text-muted-foreground">
                                    غیرفعال کردن موقت فروشگاه
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
