import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import AnimatedDiv from '@/components/animated-div';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TypewriterTitle from '@/components/typewriter-title';

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv className="max-w-3xl mx-auto">
            <TypewriterTitle text="Nuestro Blog" />
          </AnimatedDiv>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          {/* Featured Post */}
          <AnimatedDiv className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                  {featuredPost.image && (
                    <Image
                      src={featuredPost.image.imageUrl}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      data-ai-hint={featuredPost.image.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent"></div>
                </div>
                <div>
                   <Badge variant="secondary">{featuredPost.category}</Badge>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold mt-4 mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                   <div className="flex items-center gap-4 text-sm text-foreground/70 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={featuredPost.date}>{format(new Date(featuredPost.date), "d 'de' MMMM, yyyy", { locale: es })}</time>
                      </div>
                    </div>
                  <p className="text-lg text-foreground/80 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    Leer más <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedDiv>

          {/* Other Posts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <AnimatedDiv key={post.id}>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}