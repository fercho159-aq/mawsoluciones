import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="py-24 sm:py-32 md:py-40 bg-card overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
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
                ease: "easeOut"
              }
            },
          }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Transformamos Ideas en Resultados Digitales
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto"
          >
            Somos MAW Soluciones, tu socio estratégico en marketing digital. Impulsamos tu marca al siguiente nivel con creatividad, tecnología y datos.
          </motion.p>
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button size="lg" asChild className="transform hover:scale-105 transition-transform duration-300">
              <a href="#booking">Reserva tu Sesión Estratégica</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="transform hover:scale-105 transition-transform duration-300">
              <a href="#portfolio">Ver Proyectos</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
