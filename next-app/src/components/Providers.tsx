"use client";

import { CartProvider } from "@/context/CartContext";
import { LoadingProvider } from "@/context/LoadingProvider";
import { Toaster } from "@/components/ui/sonner";
import PageLoadingIndicator from "@/components/PageLoadingIndicator";
import NavigationEvents from "@/components/NavigationEvents";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LoadingProvider>
        <CartProvider>
          {children}
          <NavigationEvents />
          <Toaster />
          <PageLoadingIndicator />
        </CartProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
