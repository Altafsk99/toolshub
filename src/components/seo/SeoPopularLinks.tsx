import Link from "next/link";
import { getFeaturedSeoLandings } from "@/lib/seo/landings";

export function SeoPopularLinks() {
  const landings = getFeaturedSeoLandings();

  return (
    <section className="mt-12 border-t border-line/80 pt-10">
      <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
        Popular tools
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft/75">
        Quick links for common image tasks — all run locally in your browser.
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {landings.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/tools/image/${page.slug}`}
              className="focus-ring inline-flex rounded-full border border-line bg-paper/80 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent/50 hover:bg-mist hover:text-ink"
            >
              {page.h1}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
