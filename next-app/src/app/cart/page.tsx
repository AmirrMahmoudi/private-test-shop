import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import CartContent from "./cart-content";

export const metadata: Metadata = {
  title: "سبد خرید - فروشگاه بیوتی‌شاپ",
  description: "سبد خرید شما در فروشگاه بیوتی‌شاپ",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavbarServer />
      <CartContent />
    </div>
  );
}
