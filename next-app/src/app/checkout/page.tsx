import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import CheckoutForm from "./checkout-form";

export const metadata: Metadata = {
    title: "تسویه حساب - فروشگاه بیوتی‌شاپ",
    description: "تسویه حساب و ثبت سفارش در فروشگاه بیوتی‌شاپ",
};

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <NavbarServer />
            <CheckoutForm />
        </div>
    );
}
