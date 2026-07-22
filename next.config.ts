import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  /** Local dev: proxy /api/cv/generate to scripts/dev-cv-api.ts (port 8789). */
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/cv/generate",
          destination: "http://127.0.0.1:8789/api/cv/generate",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
