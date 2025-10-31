"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import WhatsappIcon from "../icons/whatsapp-icon";

const Hero = () => {
  return (
    <section id="home" className="pt-24 sm:pt-32 md:pt-40 bg-card overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
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
              className="max-w-4xl text-center md:text-left"
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
                className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                Transformamos Ideas en Resultados Digitales
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
                className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto md:mx-0"
              >
                Somos MAW Soluciones, tu socio estratégico en marketing digital.
                Impulsamos tu marca al siguiente nivel con creatividad, tecnología y
                datos.
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
                className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4"
              >
                <Button
                  size="lg"
                  asChild
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <a href="#booking">Reserva tu Sesión Estratégica</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                   <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="w-5 h-5 mr-2" />
                    Chatea con nosotros
                  </a>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative aspect-square max-w-lg mx-auto md:max-w-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } }}
            >
              <Image 
                src="https://images.unsplash.com/photo-1556742044-597b14072382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYWdlbmN5fGVufDB8fHx8MTc2MjExNDU1NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Agencia de marketing digital"
                fill
                className="object-contain"
                data-ai-hint="digital marketing agency"
              />
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
