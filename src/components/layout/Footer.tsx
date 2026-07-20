import Link from "next/link";

const categories = [
  { href: "/tools/image", label: "Image Tools", live: true },
  { href: "#", label: "PDF Tools", live: false },
  { href: "#", label: "Video Tools", live: false },
  { href: "#", label: "Developer Tools", live: false },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-line bg-ink text-foam">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">PrivyTool</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-foam/70">
            Fast browser-based utilities. Your files stay on your device — we never
            upload your images to a server.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foam/50">
            Categories
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((item) => (
              <li key={item.label}>
                {item.live ? (
                  <Link
                    href={item.href}
                    className="text-foam/85 transition hover:text-accent-bright"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foam/40">
                    {item.label}{" "}
                    <span className="text-[10px] uppercase tracking-wider">Soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foam/50">
            Product
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foam/85">
            <li>
              <Link
                href="/tools/image/compress"
                className="transition hover:text-accent-bright"
              >
                Compress Image
              </Link>
            </li>
            <li>
              <Link href="/tools/image/resize" className="transition hover:text-accent-bright">
                Resize Image
              </Link>
            </li>
            <li>
              <Link href="/tools/image/convert" className="transition hover:text-accent-bright">
                Convert Image
              </Link>
            </li>
            <li>
              <Link href="/tools/image/history" className="transition hover:text-accent-bright">
                History
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-foam/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} PrivyTool. All rights reserved.</p>
          <p>Processing happens in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
