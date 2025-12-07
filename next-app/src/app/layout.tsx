import type { Metadata } from "next";
// import { Vazirmatn } from "next/font/google"; // Disabled due to network issues on build server
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Providers from "@/components/Providers";

// const vazirmatn = Vazirmatn({
//   subsets: ["arabic", "latin"],
//   variable: "--font-vazirmatn",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "فروشگاه لوازم آرایشی",
  description: "بهترین محصولات آرایشی و بهداشتی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}