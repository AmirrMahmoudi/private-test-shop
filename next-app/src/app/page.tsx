// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import type { Metadata } from "next";
// import NavbarServer from "@/components/NavbarServer";
// import Hero from "@/components/Hero";
// import CategoryShowcase from "@/components/CategoryShowcase";
// import FeaturedProducts from "@/components/FeaturedProducts";

// import BrandsTicker from "@/components/BrandsTicker";
// import TrustFeatures from "@/components/TrustFeatures";
// import PromoBanner from "@/components/PromoBanner";
// import NewArrivals from "@/components/NewArrivals";

// // SEO Metadata
// export const metadata: Metadata = {
//   title: "فروشگاه لوازم آرایشی بیوتی‌شاپ | محصولات اصل و با کیفیت",
//   description:
//     "خرید لوازم آرایشی، مراقبت پوست، مراقبت مو و عطر و ادکلن با بهترین قیمت. محصولات اصل از برترین برندهای جهان.",
//   keywords: [
//     "لوازم آرایشی",
//     "مراقبت پوست",
//     "مراقبت مو",
//     "عطر و ادکلن",
//     "بیوتی شاپ",
//   ],
//   openGraph: {
//     title: "فروشگاه لوازم آرایشی بیوتی‌شاپ",
//     description: "بهترین محصولات زیبایی و آرایشی با قیمت مناسب",
//     type: "website",
//     locale: "fa_IR",
//   },
// };

// // Enable ISR for this page
// // export const revalidate = 3600; // Revalidate every hour

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col font-sans bg-background">
//       <NavbarServer />
//       <main>
//         <Hero />
//         <BrandsTicker />
//         <CategoryShowcase />
//         <FeaturedProducts />
//         <PromoBanner />
//         <NewArrivals />
//         <TrustFeatures />
//       </main>
//       <footer className="bg-muted py-8 text-center text-muted-foreground">
//         <p>© ۱۴۰۴ فروشگاه لوازم آرایشی بیوتی‌شاپ. تمامی حقوق محفوظ است.</p>
//       </footer>
//     </div>
//   );
// }


// حذف کن این خط‌ها رو کاملاً:
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// به جاش اینو بذار:
export const revalidate = 60; // هر ۶۰ ثانیه صفحه اصلی تازه بشه (کاملاً کافیه و منطقیه)

import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandsTicker from "@/components/BrandsTicker";
import TrustFeatures from "@/components/TrustFeatures";
import PromoBanner from "@/components/PromoBanner";
import NewArrivals from "@/components/NewArrivals";

export const metadata: Metadata = {
  title: "فروشگاه لوازم آرایشی بیوتی‌شاپ | محصولات اصل و با کیفیت",
  description: "خرید لوازم آرایشی، مراقبت پوست، مراقبت مو و عطر و ادکلن با بهترین قیمت.",
  keywords: ["لوازم آرایشی", "مراقبت پوست", "مراقبت مو", "عطر و ادکلن", "بیوتی شاپ"],
  openGraph: {
    title: "فروشگاه لوازم آرایشی بیوتی‌شاپ",
    description: "بهترین محصولات زیبایی و آرایشی با قیمت مناسب",
    type: "website",
    locale: "fa_IR",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <NavbarServer />
      <main>
        <Hero />
        <BrandsTicker />
        <CategoryShowcase />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
        <TrustFeatures />
      </main>
      <footer className="bg-muted py-8 text-center text-muted-foreground">
        <p>© ۱۴۰۴ فروشگاه لوازم آرایشی بیوتی‌شاپ. تمامی حقوق محفوظ است.</p>
      </footer>
    </div>
  );
}