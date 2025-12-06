"use client";

import { useEffect, useCallback } from "react";
import { useLoading } from "@/context/LoadingProvider";
import { usePathname } from "next/navigation";

/**
 * Custom Hook برای مدیریت لودینگ صفحه
 * این Hook به صورت خودکار لودینگ را زمانی که مسیر تغییر می‌کند متوقف می‌کند
 */
export function usePageLoading() {
    const { isLoading, startLoading, stopLoading } = useLoading();
    const pathname = usePathname();

    // متوقف کردن لودینگ وقتی مسیر تغییر کرد
    useEffect(() => {
        stopLoading();
    }, [pathname, stopLoading]);

    // تابع helper برای استفاده در onClick handlers
    const handleNavigationClick = useCallback((href?: string, event?: React.MouseEvent) => {
        if (href && href !== pathname) {
            startLoading();
        }
    }, [startLoading, pathname]);

    return {
        isLoading,
        startLoading,
        stopLoading,
        handleNavigationClick,
    };
}

