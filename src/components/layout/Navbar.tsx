"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

/** Slim desktop nav — hubs + content. Tool shortcuts live in the mobile menu. */
const desktopLinks = [
  { href: "/tools/image", label: "Image Tools" },
  { href: "/tools/pdf", label: "PDF Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/tools/image/history", label: "History" },
] as const;

const mobileLinks = [
  { href: "/tools/image", label: "Image Tools" },
  { href: "/tools/pdf", label: "PDF Tools" },
  { href: "/tools/image/compress", label: "Compress" },
  { href: "/tools/image/resize", label: "Resize" },
  { href: "/tools/image/crop", label: "Crop" },
  { href: "/tools/image/rotate", label: "Rotate" },
  { href: "/tools/image/flip", label: "Flip" },
  { href: "/tools/image/convert", label: "Convert" },
  { href: "/blog", label: "Blog" },
  { href: "/tools/image/history", label: "History" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/tools/image") {
    return (
      pathname === "/tools/image" ||
      (pathname.startsWith("/tools/image/") &&
        !pathname.startsWith("/tools/image/history"))
    );
  }
  if (href === "/tools/pdf") {
    return pathname === "/tools/pdf" || pathname.startsWith("/tools/pdf/");
  }
  if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClassName =
  "focus-ring rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-mist hover:text-ink md:py-1.5";

const mobileLinkClassName =
  "focus-ring block min-h-11 rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 hover:bg-mist hover:text-ink";

function MenuIcon({ open }: { open: boolean }) {
  const transition = { duration: 0.28, ease };

  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <motion.span
        className="absolute left-0 block h-0.5 w-6 rounded-full bg-current"
        initial={false}
        animate={open ? { top: 9, rotate: 45 } : { top: 2, rotate: 0 }}
        transition={transition}
        style={{ transformOrigin: "center" }}
      />
      <motion.span
        className="absolute left-0 top-[9px] block h-0.5 w-6 rounded-full bg-current"
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={transition}
      />
      <motion.span
        className="absolute left-0 block h-0.5 w-6 rounded-full bg-current"
        initial={false}
        animate={open ? { top: 9, rotate: -45 } : { top: 16, rotate: 0 }}
        transition={transition}
        style={{ transformOrigin: "center" }}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkTone = (href: string, mobile = false) => {
    const active = isActiveLink(href, pathname);
    const base = mobile ? mobileLinkClassName : linkClassName;
    return active ? `${base} bg-mist text-ink` : `${base} text-ink-soft`;
  };

  return (
    <header className="relative z-30 border-b border-line/80 bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="focus-ring group flex shrink-0 items-baseline gap-2.5 rounded-md"
        >
          <span className="font-display text-xl font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent-deep sm:text-2xl">
            PrivyTool
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-ink-soft/70 lg:inline">
            Privacy-first utilities
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkTone(link.href)}
              aria-current={isActiveLink(link.href, pathname) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <motion.button
          type="button"
          className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors duration-200 hover:bg-mist hover:text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease }}
        >
          <MenuIcon open={open} />
        </motion.button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 top-16 z-40 bg-ink/20 backdrop-blur-[1px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id={menuId}
              aria-label="Primary"
              className="absolute inset-x-0 top-full z-50 overflow-hidden border-b border-line bg-paper/95 shadow-[var(--shadow-soft)] backdrop-blur-md lg:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease }}
            >
              <ul className="mx-auto max-w-6xl divide-y divide-line px-4 py-2 sm:px-6">
                {mobileLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      duration: 0.28,
                      ease,
                      delay: 0.04 + index * 0.045,
                    }}
                  >
                    <Link
                      href={link.href}
                      className={linkTone(link.href, true)}
                      aria-current={
                        isActiveLink(link.href, pathname) ? "page" : undefined
                      }
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
