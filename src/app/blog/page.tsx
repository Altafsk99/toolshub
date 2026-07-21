import type { Metadata } from "next";
import { BlogIndexList } from "@/components/blog/BlogViews";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllBlogPosts } from "@/lib/blog/posts";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog — Image & PDF Guides",
  description:
    "Guides on compressing images to 50KB, passport photo sizes, JPG vs PNG vs WebP, Instagram resize, and private browser-side tools.",
  path: "/blog",
  keywords: [
    "privytool blog",
    "image compression guide",
    "passport photo size",
    "jpg vs png vs webp",
  ],
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "PrivyTool Blog",
          url: absoluteUrl("/blog"),
          description:
            "Guides for privacy-first image and PDF tools that run in your browser.",
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
            description: post.description,
          })),
        }}
      />
      <BlogIndexList posts={posts} />
    </>
  );
}
