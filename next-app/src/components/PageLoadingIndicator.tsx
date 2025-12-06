"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoadingIndicator() {
    const { isLoading } = useLoading();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            // شبیه‌سازی پیشرفت لودینگ
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90; // توقف در 90% تا زمانی که واقعاً لود شود
                    return prev + Math.random() * 10;
                });
            }, 200);

            return () => clearInterval(interval);
        } else {
            // تکمیل نوار پیشرفت
            setProgress(100);
            // ریست کردن بعد از انیمیشن
            const timeout = setTimeout(() => {
                setProgress(0);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    exit={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary z-[100] origin-left pointer-events-none"
                    style={{
                        boxShadow: "0 0 10px rgba(var(--primary), 0.5)",
                    }}
                />
            )}
        </AnimatePresence>
    );
}
