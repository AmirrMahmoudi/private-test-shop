import { fetchHeroSlides } from "@/lib/api";
import HeroClient from "./HeroClient";

// Fetch hero data on the server
async function getHeroData() {
  try {
    // Prioritize INTERNAL_API_URL for server-side fetching
    const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // Remove trailing /api if present to avoid duplication
    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

    // Note: We're using the new slides endpoint
    const res = await fetch(`${baseUrl}/hero/slides`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      // Fallback or empty array
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to load hero slides:", error);
    return [];
  }
}

export default async function Hero() {
  const slides = await getHeroData();

  // Map the backend data to the types expected by HeroClient if specific transformation needed
  // Assuming keys match for now based on API inspection

  return <HeroClient initialSlides={slides} />;
}
