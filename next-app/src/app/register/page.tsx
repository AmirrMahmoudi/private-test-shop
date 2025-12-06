import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "ثبت نام - فروشگاه بیوتی‌شاپ",
  description: "ثبت نام در فروشگاه بیوتی‌شاپ",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavbarServer />
      <RegisterForm />
    </div>
  );
}
