import type { Metadata } from "next";
import { Kameron, Montserrat } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const display = Kameron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "ToolsHub — Privacy-first online tools",
    template: "%s | ToolsHub",
  },
  description:
    "The world's fastest privacy-first toolkit. Compress, resize, and convert images in your browser — no upload required.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolshub.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <div className="noise-overlay mesh-bg flex min-h-full flex-1 flex-col">
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
