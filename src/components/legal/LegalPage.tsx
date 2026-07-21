import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-ink/55">Last updated: {updated}</p>

      <div className="legal-prose mt-10 space-y-8 text-[15px] leading-relaxed text-ink/80">
        {children}
      </div>

      <p className="mt-12 border-t border-line pt-6 text-sm text-ink/50">
        Also see{" "}
        <Link href="/privacy" className="text-accent-deep underline-offset-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-accent-deep underline-offset-2 hover:underline">
          Terms of Use
        </Link>
        .
      </p>
    </div>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
