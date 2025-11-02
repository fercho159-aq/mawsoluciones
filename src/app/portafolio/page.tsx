
"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { portfolioItems } from "@/lib/portfolio-data";
import { ArrowRight } from "lucide-react";
import AnimatedDiv from "@/components/animated-div";

const categories = ["Todos", "Desarrollo Web", "Creación de Contenido", "Producción de Video", "Automatización", "Campañas"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

const PortfolioPage = () => {
  return (
    <div className="bg-background">
        <section className="py-24 sm:py-32 md:py-40 bg-card">
            <div className="container mx-auto px-4 md:px-6 text-center">
            <AnimatedDiv className="max-w-3xl mx-auto">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
                Nuestros Clientes
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-foreground/80">
                Explora algunos de nuestros proyectos más exitosos y ve el impacto de nuestro trabajo.
                </p>
            </AnimatedDiv>
            </div>
        </section>

        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <Tabs defaultValue="Todos" className="w-full">
                <AnimatedDiv>
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mb-8">
                    {categories.map(category => (
                        <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                    </TabsList>
                </AnimatedDiv>
                
                {categories.map(category => (
                    <TabsContent key={category} value={category}>
                    <AnimatedDiv 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                    >
                        {portfolioItems
                        .filter(item => category === "Todos" || item.category === category)
                        .map(item => (
                            <AnimatedDiv key={item.id} variants={itemVariants}>
                            <Card className="overflow-hidden group flex flex-col h-full bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                                <Link href={`/portafolio/${item.id}`} className="flex flex-col flex-grow">
                                <CardContent className="p-0">
                                    <div className="relative aspect-w-4 aspect-h-3">
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
                                    <Badge variant="secondary" className="mb-2">{item.category}</Badge>
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
                    </TabsContent>
                ))}
                </Tabs>
            </div>
        </section>
    </div>
  );
};

export default PortfolioPage;
