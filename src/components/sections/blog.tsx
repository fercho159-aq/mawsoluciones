import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import AnimatedDiv from '@/components/animated-div';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '../ui/button';

export default function BlogSection() {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold">Últimas Entradas del Blog</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Mantente al día con las últimas tendencias y consejos de marketing digital.
          </p>
        </AnimatedDiv>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
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
                    <h3 className="font-headline text-xl font-bold mb-3 flex-grow group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-foreground/70 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>{format(new Date(post.date), "dd MMM yyyy", { locale: es })}</time>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 mb-4 line-clamp-3 flex-grow">
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
        <AnimatedDiv className="text-center mt-16">
            <Button asChild size="lg">
                <Link href="/blog">
                    Visita nuestro Blog
                    <ArrowRight className="w-4 h-4 ml-2"/>
                </Link>
            </Button>
        </AnimatedDiv>
      </div>
    </section>
  );
}
