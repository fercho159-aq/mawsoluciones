'use server';

import { db } from '@/lib/db';
import { blog_posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

export type BlogPost = typeof blog_posts.$inferSelect;

export async function getBlogPosts(): Promise<BlogPost[]> {
  noStore();
  try {
    const posts = await db.query.blog_posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.date)],
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    noStore();
    try {
        const post = await db.query.blog_posts.findFirst({
            where: eq(blog_posts.slug, slug),
        });
        return post || null;
    } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        return null;
    }
}
