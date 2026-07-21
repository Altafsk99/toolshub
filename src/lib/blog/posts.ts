import { blogPosts } from "@/content/blog/posts";
import type { BlogPost } from "@/types/blog";

const bySlug = new Map(blogPosts.map((post) => [post.slug, post]));

/** Newest first */
export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
