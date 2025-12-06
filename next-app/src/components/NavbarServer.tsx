import Link from "next/link";
import { ShoppingCart, Search, Menu, User, X, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import NavbarClient from "./NavbarClient";
import { ThemeToggle } from "@/components/ThemeToggle";

// Server-side data fetching
async function getCategories() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/categories`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return [];

        return res.json();
    } catch (error) {
        return [];
    }
}

async function getProducts() {
    try {
        const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

        const res = await fetch(`${baseUrl}/products?limit=1000`, {
            next: { revalidate: 1800 }
        });

        if (!res.ok) return [];

        const data = await res.json();
        // Handle both paginated and non-paginated responses
        return data.products || data;
    } catch (error) {
        return [];
    }
}

export default async function NavbarServer() {
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts()
    ]);

    return <NavbarClient categories={categories} products={products} />;
}

