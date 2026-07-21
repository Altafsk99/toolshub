export type BlogInlineLink = {
  href: string;
  label: string;
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "cta"; href: string; label: string; description?: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  /** Display date */
  dateLabel: string;
  keywords: string[];
  /** Related tool / SEO landing paths */
  related: BlogInlineLink[];
  blocks: BlogBlock[];
};
