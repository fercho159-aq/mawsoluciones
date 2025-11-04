import { portfolioItems } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ExternalLink, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import WhatsappIcon from "@/components/icons/whatsapp-icon";

export default function PortfolioItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = portfolioItems.find((p) => p.id === params.id);

  if (!item) {
    notFound();
  }

  const whatsappNumber = "5542314150";
  const whatsappMessage = `Hola, estoy interesado en cotizar un sitio web similar a '${item.title}'. ¿Podemos hablar?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
            
            {/* Columna Izquierda: Imagen */}
            <div className="sticky top-28">
              {item.image && (
                <div className="relative aspect-video rounded-lg shadow-2xl overflow-hidden">
                  <Image
                    src={item.image.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    data-ai-hint={item.image.imageHint}
                  />
                </div>
              )}
            </div>

            {/* Columna Derecha: Información */}
            <div className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground">
              <Badge variant="secondary" className="mb-4">{item.category}</Badge>
              <h1 className="font-headline text-4xl sm:text-5xl font-bold mb-4">
                {item.title}
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80">
                {item.description}
              </p>
              
              <div className="not-prose flex flex-col sm:flex-row gap-4 my-8">
                {item.website && (
                    <Button asChild>
                        <a href={item.website} target="_blank" rel="noopener noreferrer">
                            Visitar Sitio Web <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                )}
                 <Button asChild variant="whatsapp">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <WhatsappIcon className="w-5 h-5 mr-2" />
                        Cotizar un sitio como este
                    </a>
                </Button>
              </div>

              {item.challenge && (
                <>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold mt-12">
                    El Desafío
                  </h2>
                  <p>{item.challenge}</p>
                </>
              )}

              {item.solution && (
                <>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold mt-12">
                    Nuestra Solución
                  </h2>
                  <p>{item.solution}</p>
                </>
              )}

              {item.services && item.services.length > 0 && (
                <>
                    <h3 className="font-headline text-2xl font-bold mt-12 mb-4">Servicios Prestados</h3>
                    <ul className="not-prose space-y-3">
                    {item.services.map(service => (
                        <li key={service} className="flex items-center text-lg">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span>{service}</span>
                        </li>
                    ))}
                    </ul>
                </>
              )}

            </div>
          </div>

          <div className="text-center mt-20">
              <Button variant="outline" asChild>
                  <Link href="/portafolio">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver a Clientes
                  </Link>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static paths for each portfolio item
export async function generateStaticParams() {
  return portfolioItems.map((item) => ({
    id: item.id,
  }));
}
