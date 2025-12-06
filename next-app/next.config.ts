import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",                     // عالیه، حتماً باشه

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "backend" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true,                      // این خط رو حتماً اضافه کن (برای standalone در داکر لازمه)
  },

  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;