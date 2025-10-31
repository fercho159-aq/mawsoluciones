"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const portfolioItems = [
  {
    id: "1",
    title: "Tech Startup Website",
    category: "Desarrollo Web",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-web-1')
  },
  {
    id: "2",
    title: "Fashion Brand Socials",
    category: "Creación de Contenido",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-content-1')
  },
  {
    id: "3",
    title: "Product Launch Video",
    category: "Producción de Video",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-video-1')
  },
  {
    id: "4",
    title: "E-commerce Automation",
    category: "Automatización",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-automation-1')
  },
  {
    id: "5",
    title: "Local Business Ads",
    category: "Campañas",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-campaign-1')
  },
  {
    id: "6",
    title: "Boutique E-commerce",
    category: "Desarrollo Web",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-web-2')
  }
];

const categories = ["Todos", "Desarrollo Web", "Creación de Contenido", "Producción de Video", "Automatización", "Campañas"];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Nuestro Portafolio</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Explora algunos de nuestros proyectos más exitosos y ve el impacto de nuestro trabajo.
          </p>
        </div>

        <Tabs defaultValue="Todos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems
                  .filter(item => category === "Todos" || item.category === category)
                  .map(item => (
                    <Card key={item.id} className="overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="relative aspect-w-3 aspect-h-2">
                          {item.image && (
                            <Image
                              src={item.image.imageUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={item.image.imageHint}
                            />
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <h3 className="font-headline font-semibold text-lg">{item.title}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Portfolio;
