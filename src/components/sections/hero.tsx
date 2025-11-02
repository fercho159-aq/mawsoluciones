
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import WhatsappIcon from "../icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    image: "/images/annie-spratt-QckxruozjRg-unsplash.jpg",
    imageHint: "digital marketing agency",
    headline: "Transformamos Ideas en Resultados Digitales",
    subheadline:
      "Somos MAW Soluciones, tu socio estratégico en marketing digital. Impulsamos tu marca al siguiente nivel con creatividad, tecnología y datos.",
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3ZWJzaXRlJTIwZGV2ZWxvcG1lbnR8ZW58MHx8fHwxNzYyMjI3MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "website development team",
    headline: "Creatividad que Conecta, Diseño que Convierte",
    subheadline:
      "Desde desarrollo web de vanguardia hasta estrategias de contenido que enamoran a tu audiencia. Creamos experiencias digitales memorables.",
  },
  {
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDB8fHx8MTc2MjIyNzAyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "business team meeting",
    headline: "Tu Socio Estratégico para el Crecimiento",
    subheadline:
      "Analizamos, planificamos y ejecutamos. Nos sumergimos en tus objetivos para construir juntos el camino hacia el éxito de tu negocio.",
  },
];

const Hero = () => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    
    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    React.useEffect(() => {
        if (!api) {
        return
        }

        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


  return (
    <section
      id="home"
      className="relative min-h-[70vh] md:min-h-screen bg-card overflow-hidden"
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative flex items-center justify-center min-h-[70vh] md:min-h-screen h-full py-24 sm:py-32 md:py-40">
                <motion.div
                  className="absolute inset-0 z-0"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.headline}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    data-ai-hint={slide.imageHint}
                  />
                </motion.div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="relative z-20 container mx-auto px-4 md:px-6">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          staggerChildren: 0.2,
                          delayChildren: 0.2,
                          duration: 0.6,
                          ease: "easeOut",
                        },
                      },
                    }}
                    className="max-w-4xl text-center mx-auto"
                  >
                    <motion.h1
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.8, ease: "easeOut" },
                        },
                      }}
                      className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                    >
                      {slide.headline}
                    </motion.h1>
                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.8, ease: "easeOut" },
                        },
                      }}
                      className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto"
                    >
                      {slide.subheadline}
                    </motion.p>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.8, ease: "easeOut" },
                        },
                      }}
                      className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                    >
                      <Button size="lg" asChild>
                        <a href="#booking">Reserva tu Sesión Estratégica</a>
                      </Button>
                      <Button size="lg" variant="whatsapp" asChild>
                        <a
                          href="https://wa.me/1234567890"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsappIcon className="w-5 h-5 mr-2" />
                          Chatea con nosotros
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        current === index + 1 ? 'w-6 bg-primary' : 'bg-white/50 hover:bg-white'
                    )}
                    aria-label={`Ir a la diapositiva ${index + 1}`}
                />
            ))}
        </div>
      </Carousel>
    </section>
  );
};

export default Hero;
