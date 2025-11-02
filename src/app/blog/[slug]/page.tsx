import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-md text-foreground/70 mt-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={post.date}>{format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: es })}</time>
              </div>
            </div>
          </div>
        </div>
      </section>

      {post.image && (
        <section className="py-0">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative aspect-video max-w-5xl mx-auto -mt-20 rounded-lg shadow-2xl overflow-hidden">
              <Image
                src={post.image.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.image.imageHint}
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg lg:prose-xl max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="text-center mt-20">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

       <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para aplicar estas ideas?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Hablemos de cómo nuestras estrategias pueden llevar tu negocio al siguiente nivel.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <a href="/#booking">
                    Reserva tu Sesión Estratégica <ArrowRight className="w-5 h-5 ml-2" />
                </a>
            </Button>
        </div>
      </section>
    </div>
  );
}

// Generate static paths for each blog post
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
