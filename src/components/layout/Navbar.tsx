import Link from "next/link";

const navLinks = [
  { href: "/tools/image", label: "Image Tools" },
  { href: "/tools/image/compress", label: "Compress" },
  { href: "/tools/image/resize", label: "Resize" },
  { href: "/tools/image/convert", label: "Convert" },
  { href: "/tools/image/history", label: "History" },
];

export function Navbar() {
  return (
    <header className="relative z-20 border-b border-line/80 bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="focus-ring group flex items-baseline gap-2 rounded-md">
          <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            ToolsHub
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-ink-soft/70 sm:inline">
            Privacy-first utilities
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-mist hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
