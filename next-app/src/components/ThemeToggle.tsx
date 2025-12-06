"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // جلوگیری از hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Sun className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 hover:bg-muted rounded-full transition-all"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-primary transition-all" />
            ) : (
                <Moon className="h-5 w-5 text-primary transition-all" />
            )}
            <span className="sr-only">تغییر تم</span>
        </Button>
    );
}
