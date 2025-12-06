
"use client";

import FestivalForm from "@/components/FestivalForm";
import { useParams } from "next/navigation";

export default function EditFestivalPage() {
    const params = useParams();
    const id = params?.id as string;

    return <FestivalForm festivalId={id} />;
}
