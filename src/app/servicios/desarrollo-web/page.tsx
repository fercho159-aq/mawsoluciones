
import { Button } from "@/components/ui/button";
import { ArrowRight, CodeXml, Send, Link as LinkIcon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WebCalculator from "@/components/web-calculator";
import AnimatedDiv from "@/components/animated-div";
import WebsiteAnalyzer from "@/components/website-analyzer";
import { motion } from "framer-motion";

const siteTypes = [
  {
    title: "Landing Page",
    icon: <Send className="w-10 h-10 text-primary" />,
    description: "Páginas de aterrizaje optimizadas para una sola acción, diseñadas para maximizar la conversión de tus campañas.",
    category: "Landing",
  },
  {
    title: "Sitio Conectivo",
    icon: <LinkIcon className="w-10 h-10 text-primary" />,
    description: "Sitios web corporativos para presentar tu marca, mostrar tus servicios y conectar con tu audiencia de manera profesional.",
    category: "Connective",
  },
  {
    title: "E-commerce",
    icon: <ShoppingCart className="w-10 h-10 text-primary" />,
    description: "Plataformas robustas y seguras para vender tus productos en línea, con carritos de compra y pasarelas de pago.",
    category: "E-commerce",
  },
];


const ServicePage = () => {

  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold">
              Desarrollo Web
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Diseñamos y desarrollamos sitios web modernos, rápidos, responsivos y optimizados para la conversión que funcionan como el centro de tu ecosistema digital.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[9/16] max-w-sm mx-auto w-full rounded-lg overflow-hidden shadow-xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/UMw2F8fIvF4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Tu Negocio, Tu Sitio Web, Tus Reglas.</h2>
              <p>
                Tu sitio web es más que una tarjeta de presentación digital; es tu principal herramienta de ventas y marketing. En MAW Soluciones, construimos experiencias web a medida que no solo se ven increíbles, sino que también están diseñadas estratégicamente para atraer, enganchar y convertir a tus visitantes en clientes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Descubre tu Sitio Web Ideal</h2>
              <p className="mt-4 text-lg text-foreground/80">
              Responde unas breves preguntas y obtén una recomendación sobre el tipo de sitio web perfecto para tu negocio y una cotización al instante.
              </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <WebCalculator />
              <div className="flex flex-col gap-8">
              {siteTypes.map((type) => (
                  <AnimatedDiv key={type.title} className="group relative rounded-lg p-6 bg-background/50 hover:bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 ease-in-out">
                      <div className="flex flex-col items-center text-center">
                      <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-90">
                          {type.icon}
                          <h3 className="font-headline text-2xl mt-4 font-bold">{type.title}</h3>
                      </div>
                      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                              <p className="text-foreground/80 mb-4">{type.description}</p>
                              <Button variant="link" asChild>
                                  <Link href={`/portafolio?tab=websites&category=${type.category}`}>
                                      Ver proyectos <ArrowRight className="w-4 h-4 ml-2"/>
                                  </Link>
                              </Button>
                      </div>
                      </div>
                  </AnimatedDiv>
              ))}
              </div>
          </div>
          </div>
      </section>

      <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Diagnostica la Salud de tu Sitio Web</h2>
              <p className="mt-4 text-lg text-foreground/80">
              La velocidad, el SEO y la accesibilidad son cruciales para el éxito. Ingresa tu URL y obtén un análisis instantáneo y recomendaciones para mejorar.
              </p>
          </div>
          <WebsiteAnalyzer />
          </div>
      </section>
      
       <section className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para construir o mejorar tu presencia online?</h2>
              <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Creemos juntos un sitio web que impulse tu negocio hacia el futuro.
              </p>
              <Button size="lg" className="mt-8" asChild>
                  <Link href="/contacto">
                      Reserva tu Sesión Estratégica <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
              </Button>
          </div>
      </section>
    </div>
  );
};

export default ServicePage;
