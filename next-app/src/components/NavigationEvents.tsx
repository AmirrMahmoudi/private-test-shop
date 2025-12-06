"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingProvider";

export default function NavigationEvents() {
    const pathname = usePathname();
    const router = useRouter();
    const { startLoading, stopLoading } = useLoading();

    // وقتی مسیر تغییر می‌کند، لودینگ را متوقف می‌کنیم
    useEffect(() => {
        stopLoading();
    }, [pathname, stopLoading]);

    // رویداد کلیک روی لینک‌ها را شنود می‌کنیم
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href && link.href.startsWith(window.location.origin)) {
                const linkUrl = new URL(link.href);
                const linkPath = linkUrl.pathname;

                // اگر لینک به همان صفحه فعلی است
                if (linkPath === pathname) {
                    // اگر در صفحه اصلی هستیم و لوگو کلیک شد، صفحه رفرش شود
                    if (pathname === "/") {
                        e.preventDefault();
                        window.location.reload();
                    }
                    // در غیر این صورت، هیچ کاری نکن (نه لودینگ، نه ناوبری)
                    return;
                }

                // فقط برای لینک‌های مختلف، لودینگ را شروع کن
                startLoading();
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [startLoading, pathname]);

    return null;
}



