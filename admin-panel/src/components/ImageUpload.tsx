"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/api";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
            return;
        }

        try {
            setIsUploading(true);
            const result = await uploadImage(file);

            // Backend معمولا یک URL کامل قابل دسترس برمی‌گرداند
            // مثل: http://localhost:5001/uploads/filename.ext
            // اگر فقط مسیر نسبی برگردد (مثلاً /uploads/...)، در این صورت
            // دامنه‌ی backend (بدون /api) را به آن اضافه می‌کنیم.
            let finalUrl = result.url;

            if (!finalUrl.startsWith("http")) {
                const apiBase =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:5001/api";

                // حذف پسوند /api تا فقط origin سرور باقی بماند
                const backendOrigin = apiBase.replace(/\/api\/?$/, "");
                finalUrl = `${backendOrigin}${finalUrl}`;
            }

            onChange(finalUrl);
            toast.success("تصویر با موفقیت آپلود شد");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("خطا در آپلود تصویر");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-4 w-full">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={disabled || isUploading}
            />

            {!value ? (
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-dashed border-2 flex flex-col gap-2 hover:bg-muted/50"
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <span>برای آپلود تصویر کلیک کنید</span>
                            <span className="text-xs">PNG, JPG, GIF (حداکثر ۵ مگابایت)</span>
                        </div>
                    )}
                </Button>
            ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
