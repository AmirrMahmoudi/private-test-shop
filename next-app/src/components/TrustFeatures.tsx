import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "ضمانت اصالت کالا",
        description: "تمامی محصولات ۱۰۰٪ اورجینال هستند",
    },
    {
        icon: Truck,
        title: "ارسال سریع",
        description: "ارسال به سراسر کشور در کمترین زمان",
    },
    {
        icon: RotateCcw,
        title: "۷ روز ضمانت بازگشت",
        description: "در صورت عدم رضایت یا خرابی محصول",
    },
    {
        icon: Headphones,
        title: "مشاوره تخصصی",
        description: "راهنمایی رایگان برای انتخاب بهترین محصول",
    },
];

export default function TrustFeatures() {
    return (
        <section className="py-12 bg-secondary/30 border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg hover:bg-background transition-colors duration-300"
                        >
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
