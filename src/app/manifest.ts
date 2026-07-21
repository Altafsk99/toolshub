import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PrivyTool",
    short_name: "PrivyTool",
    description:
      "Free privacy-first image tools — compress, resize, and convert in your browser. No upload required.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfdfc",
    theme_color: "#0d8f82",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
