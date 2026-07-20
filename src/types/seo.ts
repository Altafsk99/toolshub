export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
};

export type RelatedTool = {
  href: string;
  title: string;
  description: string;
};

export type ToolPageContent = {
  slug: string;
  category: "image";
  title: string;
  description: string;
  h1: string;
  intro: string;
  howTo: HowToStep[];
  faqs: FaqItem[];
  related: RelatedTool[];
  keywords?: string[];
};
