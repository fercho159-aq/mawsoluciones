
"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { portfolioItems, portfolioCategories, portfolioSectors } from "@/lib/portfolio-data";
import { ArrowRight, Link as LinkIcon, Send, ShoppingCart } from "lucide-react";
import AnimatedDiv from "@/components/animated-div";
import React, { useState } from "react";
import GlitchTitle from "@/components/glitch-title";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const categoryIcons: { [key: string]: React.ReactNode } = {
  "E-commerce": <ShoppingCart className="w-4 h-4" />,
  "Connective": <LinkIcon className="w-4 h-4" />,
  "Landing": <Send className="w-4 h-4" />,
};

const PortfolioPage = () => {
  const [giroFilter, setGiroFilter] = useState<string>("Todos");
  const [sectorFilter, setSectorFilter] = useState<string>("Todos");

  const filteredItems = portfolioItems.filter(item => {
    const giroMatch = giroFilter === "Todos" || item.category === giroFilter;
    const sectorMatch = sectorFilter === "Todos" || item.sector === sectorFilter;
    return giroMatch && sectorMatch;
  });

  return (
    <div className="bg-background">
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">

          <div className="mb-16">
            <GlitchTitle text="Sitios Web" />
          </div>

          <AnimatedDiv>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Filtrar por Giro</label>
                <Select value={giroFilter} onValueChange={setGiroFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Giro" />
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
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AnimatedDiv>

          <AnimatedDiv
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
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
                            data-ai-hint={item.image.imageHint}
                          />
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex flex-col items-start flex-grow">
                      <Badge variant="secondary" className="mb-2">
                        <div className="flex items-center gap-1.5">
                            {categoryIcons[item.category] || null}
                            <span>{item.category}</span>
                        </div>
                      </Badge>
                      <h3 className="font-headline font-semibold text-lg flex-grow">{item.title}</h3>
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

        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
