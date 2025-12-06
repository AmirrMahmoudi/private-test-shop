"use client";

import { Home, Package, ShoppingCart, Settings, Tag, Grid, Image, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
    {
        title: "داشبورد",
        href: "/",
        icon: Home,
    },
    {
        title: "محصولات",
        href: "/products",
        icon: Package,
    },
    {
        title: "برندها",
        href: "/brands",
        icon: Tag,
    },
    {
        title: "دسته‌بندی‌ها",
        href: "/categories",
        icon: Grid,
    },
    {
        title: "سفارشات",
        href: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "جشنواره‌ها",
        href: "/festivals",
        icon: Tag,
    },
    {
        title: "مدیریت بنر",
        href: "/hero",
        icon: Image,
    },
    {
        title: "تنظیمات",
        href: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-l">
                <div className="flex items-center flex-shrink-0 px-4 mb-8">
                    <h2 className="text-2xl font-bold text-primary">پنل مدیریت</h2>
                </div>
                <nav className="flex-1 px-3 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="p-4 border-t">
                    {user && (
                        <div className="mb-3 px-3">
                            <p className="text-sm font-medium text-foreground">{user.name || 'مدیر'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>خروج از حساب</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

