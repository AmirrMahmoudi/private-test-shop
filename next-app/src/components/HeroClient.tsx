
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Types need to be defined here or imported.
// Assuming Hero type structure from usages.
export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    button1Text?: string;
    button1Link?: string;
    button2Text?: string;
    button2Link?: string;
}

interface HeroClientProps {
    initialSlides: HeroSlide[];
}

// Helper to ensure valid image URL
const getImageUrl = (src: string) => {
    if (!src) return '/placeholder.jpg'; // Add a local placeholder if needed
    if (src.startsWith('http')) return src;
    // If it's a relative path from our backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove /api if present in base URL as uploads are usually at root /uploads
    const baseUrl = API_URL.replace(/\/api$/, '');
    return `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
};

export default function HeroClient({ initialSlides }: HeroClientProps) {
    const [current, setCurrent] = useState(0);
    const slides = initialSlides.length > 0 ? initialSlides : [];

    // Autoplay
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds for better read time
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    if (slides.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-6 md:py-8">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-muted/20 border border-white/10 group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={getImageUrl(slides[current].image)}
                                alt={slides[current].title}
                                fill
                                className="object-cover"
                                priority={current === 0}
                                unoptimized
                            />
                            {/* Modern Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex items-center">
                            <div className="px-8 md:px-16 max-w-2xl text-white">
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="space-y-6"
                                >
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                                        {slides[current].title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 line-clamp-3 font-light leading-relaxed">
                                        {slides[current].subtitle}
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        {slides[current].button1Text && (
                                            <Link href={slides[current].button1Link || "#"}>
                                                <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-105">
                                                    {slides[current].button1Text}
                                                </Button>
                                            </Link>
                                        )}
                                        {slides[current].button2Text && (
                                            <Link href={slides[current].button2Link || "#"}>
                                                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md rounded-full transition-transform hover:scale-105">
                                                    {slides[current].button2Text}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows - Only show on hover for cleaner look */}
                {slides.length > 1 && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Dots Indicator */}
                {slides.length > 1 && (
                    <div className="absolute bottom-6 right-8 z-20 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    current === index ? "w-8 bg-primary" : "w-4 bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
