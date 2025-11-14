
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, CodeXml, Bot, Megaphone, ArrowRight, Link as LinkIcon, Send, ShoppingCart, Briefcase, Building, Film, HeartHandshake, Utensils, Construction, Car, Flower, Hospital, Newspaper, Camera } from "lucide-react";
import Link from "next/link";
import AnimatedDiv from "../animated-div";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { portfolioItems, portfolioCategories, portfolioSectors, contentPortfolioItems } from "@/lib/portfolio-data";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from '../ui/button';
import { CardFooter } from '../ui/card';

const services = [
  {
    icon: <CodeXml className="w-10 h-10 text-primary" />,
    title: "Sitios Web",
    description: "que te importa",
    href: "/servicios/desarrollo-web"
  },
  {
    icon: <PenSquare className="w-10 h-10 text-primary" />,
    title: "Contenido",
    description: "que te importa",
    href: "/servicios/creacion-de-contenido"
  },
  {
    icon: <Megaphone className="w-10 h-10 text-primary" />,
    title: "Ads",
    description: "que te importa",
    href: "/servicios/gestion-de-campanas"
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "Automatización",
    description: "que te importa",
    href: "/servicios/automatizacion"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: "easeOut"
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1]
    }
  },
};

const categoryIcons: { [key: string]: React.ReactNode } = {
  "E-commerce": <ShoppingCart className="w-4 h-4" />,
  "Connective": <LinkIcon className="w-4 h-4" />,
  "Landing": <Send className="w-4 h-4" />,
  "Catálogo": <Briefcase className="w-4 h-4" />,
  "Servicios": <HeartHandshake className="w-4 h-4" />,
};

const sectorIcons: { [key: string]: React.ReactNode } = {
    "Servicios Profesionales": <Briefcase className="w-4 h-4" />,
    "Inmobiliaria": <Building className="w-4 h-4" />,
    "Eventos": <Film className="w-4 h-4" />,
    "Actividades Recreativas": <HeartHandshake className="w-4 h-4" />,
    "Restaurantes": <Utensils className="w-4 h-4" />,
    "Industrial": <Construction className="w-4 h-4" />,
    "Ropa y Moda": <ShoppingCart className="w-4 h-4" />,
    "Florería": <Flower className="w-4 h-4" />,
    "Salud": <Hospital className="w-4 h-4" />,
    "Noticias": <Newspaper className="w-4 h-4" />,
    "Otros": <Briefcase className="w-4 h-4" />,
    "Automotriz": <Car className="w-4 h-4" />,
    "Software": <Bot className="w-4 h-4" />,
    "Influencers": <Camera className="w-4 h-4" />,
};

const Services = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [sectorFilter, setSectorFilter] = useState<string>("Todos");
  const [contentSectorFilter, setContentSectorFilter] = useState<string>("Todos");

  const filteredItems = portfolioItems.filter(item => {
    const categoryMatch = categoryFilter === "Todos" || item.category === categoryFilter;
    const sectorMatch = sectorFilter === "Todos" || item.sector === sectorFilter;
    return categoryMatch && sectorMatch;
  }).slice(0, 3);
  
  const allContentSectors = Array.from(new Set(contentPortfolioItems.map(item => item.sector)));

  const filteredContentItems = contentPortfolioItems.filter(item => {
    const sectorMatch = contentSectorFilter === "Todos" || item.sector === contentSectorFilter;
    return sectorMatch;
  }).slice(0, 3);


  return (
    <>
      <section id="services" className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedDiv className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Todo lo que necesitas para crecer</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Ofrecemos una gama completa de soluciones de marketing digital diseñadas para llevar tu negocio al siguiente nivel.
            </p>
          </AnimatedDiv>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <AnimatedDiv
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {services.map((service, index) => (
                <AnimatedDiv key={index} variants={itemVariants}>
                  <Link href={service.href} className="h-full block group">
                    <Card className="h-full flex flex-col bg-background/50 hover:bg-background border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                        <CardHeader className="p-6 pb-4">
                          {service.icon}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col p-6 pt-0">
                          <CardTitle className="font-headline text-2xl mb-2">{service.title}</CardTitle>
                          <CardDescription className="flex-grow text-base text-foreground/70">{service.description}</CardDescription>
                          <div className="flex items-center text-primary mt-4 font-semibold">
                              Saber más <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                    </Card>
                  </Link>
                </AnimatedDiv>
              ))}
            </AnimatedDiv>
            <AnimatedDiv>
              <div className="relative aspect-[9/16] max-w-sm mx-auto w-full rounded-lg overflow-hidden shadow-2xl">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/fnuCiuhV0WA"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedDiv className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Casos de Éxito</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Explora una selección de nuestros proyectos y descubre cómo hemos ayudado a empresas a alcanzar sus objetivos.
            </p>
          </AnimatedDiv>

          <Tabs defaultValue="websites" className="w-full max-w-5xl mx-auto">
              <AnimatedDiv>
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="websites">Sitios Web</TabsTrigger>
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                  </TabsList>
                </div>
              </AnimatedDiv>
              
              <TabsContent value="websites">
                <AnimatedDiv>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Filtrar por Categoría</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          {portfolioCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Filtrar por Sector</label>
                      <Select value={sectorFilter} onValueChange={setSectorFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          {portfolioSectors.map(sector => (
                            <SelectItem key={sector} value={sector}>
                                <div className="flex items-center gap-2">
                                  {sectorIcons[sector as keyof typeof sectorIcons] || <Briefcase className="w-4 h-4" />}
                                  <span>{sector}</span>
                                </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AnimatedDiv>

                <AnimatedDiv
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredItems.map(item => (
                    <AnimatedDiv key={item.id} variants={itemVariants}>
                      <Card className="overflow-hidden group flex flex-col h-full bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                        <Link href={`/portafolio/${item.id}`} className="flex flex-col flex-grow">
                          <CardContent className="p-0">
                            <div className="relative aspect-video bg-muted">
                              {item.image && (
                                <Image
                                  src={item.image.imageUrl}
                                  alt={item.title}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  data-ai-hint={item.image.imageHint || ''}
                                />
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 flex flex-col items-start flex-grow">
                            <Badge variant="secondary" className="mb-2">
                              <div className="flex items-center gap-1.5">
                                  {categoryIcons[item.category as keyof typeof categoryIcons] || null}
                                  <span>{item.category}</span>
                              </div>
                            </Badge>
                            <h3 className="font-headline font-semibold text-md flex-grow flex items-center gap-2">
                              {sectorIcons[item.sector as keyof typeof sectorIcons] || <Briefcase className="w-4 h-4" />}
                              <span>{item.title}</span>
                            </h3>
                            <div className="flex items-center text-sm text-primary mt-4 self-start">
                              Ver Proyecto <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </CardFooter>
                        </Link>
                      </Card>
                    </AnimatedDiv>
                  ))}
                </AnimatedDiv>
                
                {filteredItems.length === 0 && (
                  <AnimatedDiv className="text-center py-16">
                      <p className="text-lg text-foreground/80">No se encontraron proyectos con los filtros seleccionados.</p>
                  </AnimatedDiv>
                )}
              </TabsContent>
              
              <TabsContent value="content">
                <AnimatedDiv>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Filtrar por Sector</label>
                      <Select value={contentSectorFilter} onValueChange={setContentSectorFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          {allContentSectors.map(sector => (
                            <SelectItem key={sector} value={sector}>
                               <div className="flex items-center gap-2">
                                  {sectorIcons[sector as keyof typeof sectorIcons] || <Briefcase className="w-4 h-4" />}
                                  <span>{sector}</span>
                               </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AnimatedDiv>
                <AnimatedDiv
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredContentItems.map(item => (
                      <AnimatedDiv key={item.id} variants={itemVariants}>
                        <Card className="overflow-hidden group flex flex-col h-full bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow">
                            <CardContent className="p-0">
                              <div className="relative aspect-video bg-muted">
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
                            <CardFooter className="p-4 flex flex-col items-start flex-grow">
                              <Badge variant="secondary" className="mb-2">
                                {item.sector}
                              </Badge>
                              <h3 className="font-headline font-semibold text-md flex-grow">
                                {item.title}
                              </h3>
                              <div className="flex items-center text-sm text-primary mt-4 self-start">
                                Ver Contenido <ArrowRight className="w-4 h-4 ml-2" />
                              </div>
                            </CardFooter>
                          </a>
                        </Card>
                      </AnimatedDiv>
                    ))}
                  </AnimatedDiv>
                  {filteredContentItems.length === 0 && (
                    <AnimatedDiv className="text-center py-16">
                      <p className="text-lg text-foreground/80">No se encontraron proyectos con los filtros seleccionados.</p>
                    </AnimatedDiv>
                  )}
              </TabsContent>
            </Tabs>

            <AnimatedDiv className="text-center mt-16">
              <Button className="w-full sm:w-auto" asChild size="lg">
                <Link href="/portafolio">Ver todos los proyectos</Link>
              </Button>
          </AnimatedDiv>

        </div>
      </section>
    </>
  );
};

export default Services;

    

    