import type { FaqItem, HowToStep, RelatedTool } from "@/types/seo";
import Link from "next/link";

export function HowToSection({ steps }: { steps: HowToStep[] }) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        How to use
      </h2>
      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li key={step.name} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-semibold text-accent-deep">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{step.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft/80">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">FAQ</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-accent transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft/80">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  if (!tools.length) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Related tools
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="focus-ring block rounded-[var(--radius-md)] border border-transparent px-1 py-2 transition hover:border-line hover:bg-paper"
            >
              <p className="font-semibold text-ink">{tool.title}</p>
              <p className="mt-1 text-sm text-ink-soft/75">{tool.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
