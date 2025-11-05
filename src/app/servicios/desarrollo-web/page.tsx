
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, CodeXml, Send, Link as LinkIcon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import ParallaxImages from "@/components/sections/parallax-images";
import Link from "next/link";
import WebCalculator from "@/components/web-calculator";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedDiv from "@/components/animated-div";

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
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative min-h-screen">
               <ParallaxImages 
                laptopImage="/images/desarrollo web/2.png"
                phoneImage="/images/desarrollo web/4.png"
              />
            </div>
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Tu Negocio, Tu Sitio Web, Tus Reglas.</h1>
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
      
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para construir tu presencia online?</h2>
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
