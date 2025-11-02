import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import ParallaxImages from "@/components/sections/parallax-images";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
              Desarrollo Web
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Diseñamos y desarrollamos sitios web modernos, rápidos, responsivos y optimizados para la conversión que funcionan como el centro de tu ecosistema digital.
            </p>
          </div>
        </div>
      </section>
      
      <ParallaxImages />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
               <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3NjIwOTM0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Desarrollo Web"
                fill
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="web development"
              />
            </div>
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Tu Negocio, Tu Sitio Web, Tus Reglas.</h2>
              <p>
                Tu sitio web es más que una tarjeta de presentación digital; es tu principal herramienta de ventas y marketing. En MAW Soluciones, construimos experiencias web a medida que no solo se ven increíbles, sino que también están diseñadas estratégicamente para atraer, enganchar y convertir a tus visitantes en clientes.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Diseño UI/UX Centrado en el Usuario:</strong> Creamos interfaces intuitivas y atractivas que ofrecen la mejor experiencia de usuario.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Desarrollo a Medida:</strong> Sitios web corporativos, e-commerce, landing pages y aplicaciones web construidas con las últimas tecnologías.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Optimización de Rendimiento (WPO):</strong> Garantizamos tiempos de carga ultra-rápidos para mejorar el SEO y la retención de usuarios.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>SEO Técnico y On-Page:</strong> Construimos tu sitio sobre una base sólida para un excelente posicionamiento en Google.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para construir tu presencia online?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Creemos juntos un sitio web que impulse tu negocio hacia el futuro.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <a href="/#booking">
                    Reserva tu Sesión Estratégica <ArrowRight className="w-5 h-5 ml-2" />
                </a>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
