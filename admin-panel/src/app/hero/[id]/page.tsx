
"use client";

import HeroForm from "@/components/HeroForm";
import { useParams } from "next/navigation";

export default function EditHeroPage() {
    const params = useParams();
    const id = params?.id as string;

    return <HeroForm heroId={id} />;
}
