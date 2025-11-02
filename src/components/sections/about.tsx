
"use client";

import AnimatedDiv from "../animated-div";
import { Button } from "../ui/button";
import WhatsappIcon from "../icons/whatsapp-icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import React, { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { PauseCircle, PlayCircle } from "lucide-react";

const whyHireUsPoints = [
  {
    title: "Experiencia y Conocimiento Especializado",
    description: "Accede a un equipo de profesionales en SEO, contenido, publicidad y más, sin el coste de contratarlos individualmente. Nos mantenemos al día de las últimas tendencias para que tú no tengas que hacerlo.",
    image: PlaceHolderImages.find(p => p.id === 'service-web-development')
  },
  {
    title: "Ahorro de Tiempo y Dinero",
    description: "Contratar una agencia es más rentable que formar un equipo de marketing interno. Ahorra en salarios, formación y en las costosas herramientas profesionales que nosotros ya tenemos.",
    image: PlaceHolderImages.find(p => p.id === 'service-campaigns')
  },
  {
    title: "Resultados Medibles y ROI",
    description: "Nos enfocamos en los datos. Tomamos decisiones basadas en análisis para optimizar continuamente tus campañas y demostrar un retorno de inversión claro y tangible para tu negocio.",
    image: {
      id: "blog-seo-fix",
      description: "Person working on a laptop with charts",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxTRU98ZW58MHx8fHwxNzYyMTk4ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "analytics dashboard"
    }
  },
  {
    title: "Enfoque en tu Negocio",
    description: "Delega el marketing a los expertos y libera tu tiempo para centrarte en lo que mejor sabes hacer: dirigir y hacer crecer tu negocio. Nosotros nos encargamos de traerte los clientes.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-2')
  }
];


const About = () => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)

    const plugin = React.useRef(
      Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    )

    useEffect(() => {
        if (!api) {
        return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const togglePlay = () => {
        if (isPlaying) {
            plugin.current.stop()
        } else {
            plugin.current.play()
        }
        setIsPlaying(!isPlaying)
    }

  return (
    <section id="about" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">¿Por qué contratar una Agencia de Marketing?</h2>
          <p className="mt-4 text-lg text-foreground/80">
            En un mundo digital que cambia constantemente, un socio estratégico es tu mayor ventaja competitiva.
          </p>
        </AnimatedDiv>
        
        <AnimatedDiv>
            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-8">
                {whyHireUsPoints.map((point, index) => (
                  <CarouselItem key={index} className="pl-8 md:basis-3/4 lg:basis-2/3">
                    <div className="p-1 h-full">
                        <div className="flex flex-col h-full rounded-lg overflow-hidden">
                            <div className="bg-background/40 rounded-lg p-6 text-center shadow-inner">
                                <h3 className="font-headline text-3xl font-bold mb-2">{point.title}</h3>
                                <p className="text-foreground/80 max-w-xl mx-auto">{point.description}</p>
                            </div>
                            {point.image && (
                            <div className="relative aspect-video mt-6 rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                src={point.image.imageUrl}
                                alt={point.title}
                                fill
                                className="object-cover"
                                data-ai-hint={point.image.imageHint}
                                />
                            </div>
                            )}
                        </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex items-center justify-center gap-4 mt-8">
                {whyHireUsPoints.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn("w-2 h-2 rounded-full bg-foreground/30 transition-all", { "w-6 bg-primary": current === index })}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                    />
                ))}
                <button onClick={togglePlay} className="text-foreground/50 hover:text-foreground transition-colors" aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}>
                    {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </button>
            </div>
        </AnimatedDiv>

        <AnimatedDiv className="text-center mt-20">
          <h3 className="font-headline text-2xl sm:text-3xl font-bold">Únete a nuestra historia de éxito</h3>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Nos encantaría conocer tu proyecto y ayudarte a escribir el próximo capítulo.
          </p>
          <Button size="lg" className="mt-8" variant="whatsapp" asChild>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="w-5 h-5 mr-2" />
              Contáctanos por WhatsApp
            </a>
          </Button>
        </AnimatedDiv>
      </div>
    </section>
  )
}

export default About;
