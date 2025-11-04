"use client";

import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { interviews } from '@/lib/interviews-data';
import { Badge } from '@/components/ui/badge';
import AnimatedDiv from '@/components/animated-div';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TypewriterTitle from '@/components/typewriter-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';

const allPosts = [...blogPosts, ...interviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const newsPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const interviewPosts = interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const PostCard = ({ post }: { post: (typeof allPosts)[0] }) => (
  <AnimatedDiv>
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
        {post.image && (
          <div className="relative aspect-video">
            <Image
              src={post.image.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={post.image.imageHint}
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>
          <h3 className="font-headline text-lg font-bold mb-3 flex-grow group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-foreground/70 mb-4">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <time dateTime={post.date}>{format(new Date(post.date), "dd MMM yyyy", { locale: es })}</time>
            </div>
          </div>
          <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm text-primary mt-auto font-semibold">
            Leer más <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  </AnimatedDiv>
);


export default function BlogPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'all';

  const featuredPost = allPosts[0];
  
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
                {allPosts.map((post) => (
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

        </div>
      </section>
    </div>
  );
}