"use client";

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import AnimatedDiv from '@/components/animated-div';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TypewriterTitle from '@/components/typewriter-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { BlogPost } from './_actions';
import { getBlogPosts } from './_actions';

const PostCard = ({ post }: { post: BlogPost }) => (
  <AnimatedDiv>
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
        <div className="p-6 flex flex-col flex-grow">
          {post.category && <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>}
          <h3 className="font-headline text-lg font-bold mb-3 flex-grow group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-foreground/70 mb-4">
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <time dateTime={new Date(post.date).toISOString()}>{format(new Date(post.date), "dd MMM yyyy", { locale: es })}</time>
            </div>
          </div>
          {post.excerpt && (
            <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center text-sm text-primary mt-auto font-semibold">
            Leer más <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  </AnimatedDiv>
);

async function BlogPageContent() {
  const posts = await getBlogPosts();
  
  const newsPosts = posts.filter(p => p.category === 'Noticias');
  const interviewPosts = posts.filter(p => p.category === 'Entrevistas');

  // We can't use searchParams in a server component that is not a page.
  // We'll pass the defaultTab logic to the client component wrapper if needed,
  // or just default to 'all'. For now, let's keep it simple.
  const defaultTab = 'all';

  return (
     <Tabs defaultValue={defaultTab} className="w-full">
        <AnimatedDiv className="flex justify-center mb-12">
            <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="news">Noticias</TabsTrigger>
            <TabsTrigger value="interviews">Entrevistas</TabsTrigger>
            </TabsList>
        </AnimatedDiv>

        <TabsContent value="all">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>
        </TabsContent>
        <TabsContent value="news">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>
        </TabsContent>
        <TabsContent value="interviews">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviewPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>
        </TabsContent>
    </Tabs>
  )
}


export default function BlogPage() {
  return (
    <div className="bg-background">
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv className="max-w-3xl mx-auto">
            <TypewriterTitle text="Nuestro Blog" />
          </AnimatedDiv>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
            <Suspense fallback={<div>Cargando...</div>}>
                <BlogPageContent />
            </Suspense>
        </div>
      </section>
    </div>
  );
}
