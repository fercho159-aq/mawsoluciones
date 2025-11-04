import { portfolioItems } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import AnimatedDiv from "@/components/animated-div";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


export default function PortfolioItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = portfolioItems.find((p) => p.id === params.id);

  if (!item) {
    notFound();
  }

  const similarProjects = portfolioItems
    .filter(p => p.id !== item.id && p.category === item.category)
    .slice(0, 4);

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

      {similarProjects.length > 0 && (
        <section className="py-20 md:py-28 border-t bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedDiv className="text-center mb-16">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Más proyectos similares</h2>
            </AnimatedDiv>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {similarProjects.map((project) => (
                  <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                       <Card className="overflow-hidden group flex flex-col h-full bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                          <Link href={`/portafolio/${project.id}`} className="flex flex-col flex-grow">
                              <CardContent className="p-0">
                              <div className="relative aspect-video">
                                  {project.image && (
                                  <Image
                                      src={project.image.imageUrl}
                                      alt={project.title}
                                      fill
                                      sizes="(max-width: 640px) 100vw, 50vw"
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      data-ai-hint={project.image.imageHint}
                                  />
                                  )}
                              </div>
                              </CardContent>
                              <CardFooter className="p-4 flex flex-col items-start flex-grow">
                              <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                              <h3 className="font-headline font-semibold text-lg flex-grow">{project.title}</h3>
                              <div className="flex items-center text-sm text-primary mt-4 self-start">
                                  Ver Proyecto <ArrowRight className="w-4 h-4 ml-2" />
                              </div>
                              </CardFooter>
                          </Link>
                        </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </section>
      )}
    </div>
  );
}

// Generate static paths for each portfolio item
export async function generateStaticParams() {
  return portfolioItems.map((item) => ({
    id: item.id,
  }));
}
