import Link from "next/link";
import type { BlogBlock, BlogPost } from "@/types/blog";

function BlogBlocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed text-ink/80">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return <p key={index}>{block.text}</p>;
          case "h2":
            return (
              <h2
                key={index}
                className="scroll-mt-24 pt-2 font-display text-xl font-semibold text-ink"
              >
                {block.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={index} className="list-disc space-y-2 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="list-decimal space-y-2 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <aside
                key={index}
                className="rounded-md border border-line bg-mist/60 px-4 py-3 text-sm text-ink-soft"
              >
                {block.text}
              </aside>
            );
          case "cta":
            return (
              <div
                key={index}
                className="rounded-md border border-line bg-paper px-5 py-5"
              >
                {block.description ? (
                  <p className="text-sm text-ink/65">{block.description}</p>
                ) : null}
                <Link
                  href={block.href}
                  className="focus-ring mt-3 inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft"
                >
                  {block.label}
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-ink/50">
        <Link href="/blog" className="transition hover:text-accent-deep">
          Blog
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-ink/70">{post.title}</span>
      </nav>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
        Guide
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink/60">{post.description}</p>
      <p className="mt-3 text-sm text-ink/45">
        <time dateTime={post.publishedAt}>{post.dateLabel}</time>
        <span className="mx-2" aria-hidden>
          ·
        </span>
        PrivyTool
      </p>

      <div className="mt-10">
        <BlogBlocks blocks={post.blocks} />
      </div>

      {post.related.length > 0 ? (
        <aside className="mt-12 border-t border-line pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            Related tools
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring inline-flex rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-mist"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}

export function BlogIndexList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
        Blog
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        Guides & tips
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/65">
        Practical notes on compressing, resizing, and converting images — plus why
        browser-side tools keep your files private.
      </p>

      <ul className="mt-12 divide-y divide-line/80 border-y border-line/80">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-6 transition-colors focus-ring rounded-sm"
            >
              <time
                dateTime={post.publishedAt}
                className="text-xs font-medium uppercase tracking-wider text-ink/45"
              >
                {post.dateLabel}
              </time>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent-deep sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
