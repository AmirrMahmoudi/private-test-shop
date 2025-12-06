import NavbarServer from "@/components/NavbarServer";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <NavbarServer />
            <ProductDetailSkeleton />
        </div>
    );
}
