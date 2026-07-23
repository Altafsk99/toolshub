import Link from "next/link";

const imageLinks = [
  { href: "/tools/image", label: "All image tools" },
  { href: "/tools/image/compress", label: "Compress" },
  { href: "/tools/image/scan", label: "Scan" },
  { href: "/tools/image/resize", label: "Resize" },
  { href: "/tools/image/convert", label: "Convert" },
  { href: "/tools/image/crop", label: "Crop" },
  { href: "/tools/image/rotate", label: "Rotate" },
  { href: "/tools/image/flip", label: "Flip" },
];

const pdfLinks = [
  { href: "/tools/pdf", label: "All PDF tools" },
  { href: "/tools/pdf/compress", label: "Compress" },
  { href: "/tools/pdf/merge", label: "Merge" },
  { href: "/tools/pdf/split", label: "Split" },
  { href: "/tools/pdf/rotate", label: "Rotate" },
  { href: "/tools/pdf/images-to-pdf", label: "Images to PDF" },
];

const moreLinks = [
  { href: "/guide", label: "How to use" },
  { href: "/blog", label: "Blog" },
  { href: "/tools/image/history", label: "History" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foam/50">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-foam/85">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="transition hover:text-accent-bright">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-line bg-ink text-foam">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl font-bold">PrivyTool</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-foam/70">
            Fast browser-based utilities. Your files stay on your device — we never
            upload your images or PDFs to a server.
          </p>
          <p className="mt-4 text-xs text-foam/40">
            Video &amp; developer tools — soon
          </p>
        </div>

        <FooterColumn title="Image" links={imageLinks} />
        <FooterColumn title="PDF" links={pdfLinks} />
        <FooterColumn title="More" links={moreLinks} />
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
