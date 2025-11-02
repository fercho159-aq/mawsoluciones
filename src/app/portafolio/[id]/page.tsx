

import { portfolioItems } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ParallaxImages from "@/components/sections/parallax-images";

export default function PortfolioItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = portfolioItems.find((p) => p.id === params.id);

  if (!item) {
    notFound();
  }

  const defaultLaptopImage = "/images/desarrollo web/2.png";
  const defaultPhoneImage = "/images/desarrollo web/4.png";

  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">{item.category}</Badge>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
              {item.title}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              {item.description}
            </p>
          </div>
        </div>
      </section>

      <ParallaxImages 
        laptopImage={item.parallaxImages?.laptop ?? defaultLaptopImage}
        phoneImage={item.parallaxImages?.phone ?? defaultPhoneImage}
      />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="md:col-span-2 prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
                El Desafío
              </h2>
              <p>{item.challenge}</p>

              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground mt-12">
                Nuestra Solución
              </h2>
              <p>{item.solution}</p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-4">Cliente</h3>
                <p className="text-lg text-foreground/80">{item.client}</p>
              </div>

              <div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-4">Servicios Prestados</h3>
                <ul className="space-y-3">
                  {item.services.map(service => (
                    <li key={service} className="flex items-center text-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {item.website && (
                 <div>
                    <Button asChild>
                        <a href={item.website} target="_blank" rel="noopener noreferrer">
                            Visitar Sitio Web <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                 </div>
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
