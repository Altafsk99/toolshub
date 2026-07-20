import type { ReactNode } from "react";
import { FaqSection, HowToSection, RelatedTools } from "@/components/seo/ToolSections";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  buildWebApplicationJsonLd,
} from "@/lib/seo/metadata";
import type { ToolPageContent } from "@/types/seo";

type ToolPageTemplateProps = {
  content: ToolPageContent;
  children: ReactNode;
};

export function ToolPageTemplate({ content, children }: ToolPageTemplateProps) {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={buildWebApplicationJsonLd(content)} />
      <JsonLd data={buildFaqJsonLd(content)} />
      <JsonLd data={buildHowToJsonLd(content)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Image Tools", path: "/tools/image" },
          { name: content.h1, path: `/tools/image/${content.slug}` },
        ])}
      />

      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
          Image Tools
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
          {content.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft/80 sm:text-lg">
          {content.intro}
        </p>
      </header>

      <div className="mt-10">{children}</div>

      <HowToSection steps={content.howTo} />
      <FaqSection faqs={content.faqs} />
      <RelatedTools tools={content.related} />
    </div>
  );
}
