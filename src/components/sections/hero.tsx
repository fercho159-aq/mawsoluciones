
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import WhatsappIcon from "../icons/whatsapp-icon";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[70vh] md:min-h-screen py-24 sm:py-32 md:py-40 bg-card overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Image 
          src="/images/charlesdeluvio-Lks7vei-eAg-unsplash.jpg"
          alt="Agencia de marketing digital"
          fill
          priority
          className="object-cover"
          data-ai-hint="digital marketing agency"
        />
      </motion.div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-20 container mx-auto px-4 md:px-6">
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
            className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto"
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
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
            >
              <a href="#booking">Reserva tu Sesión Estratégica</a>
            </Button>
            <Button
              size="lg"
              variant="whatsapp"
              asChild
            >
               <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="w-5 h-5 mr-2" />
                Chatea con nosotros
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
