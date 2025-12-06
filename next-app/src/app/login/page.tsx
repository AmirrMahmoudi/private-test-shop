import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "ورود - فروشگاه بیوتی‌شاپ",
  description: "ورود به حساب کاربری فروشگاه بیوتی‌شاپ",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavbarServer />
      <LoginForm />
    </div>
  );
}
