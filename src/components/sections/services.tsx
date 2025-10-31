import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, CodeXml, Camera, Bot, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import AnimatedDiv from "../animated-div";

const services = [
  {
    icon: <PenSquare className="w-10 h-10 text-primary" />,
    title: "Creación de Contenido",
    description: "Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca.",
    href: "/servicios/creacion-de-contenido"
  },
  {
    icon: <CodeXml className="w-10 h-10 text-primary" />,
    title: "Desarrollo Web",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión.",
    href: "/servicios/desarrollo-web"
  },
  {
    icon: <Camera className="w-10 h-10 text-primary" />,
    title: "Producción de Foto/Video",
    description: "Producimos material audiovisual profesional que captura la esencia de tu marca y cuenta tu historia.",
    href: "/servicios/produccion-foto-video"
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "Automatización de Marketing",
    description: "Implementamos sistemas de automatización para nutrir leads y optimizar tus embudos de venta.",
    href: "/servicios/automatizacion"
  },
  {
    icon: <Megaphone className="w-10 h-10 text-primary" />,
    title: "Gestión de Campañas",
    description: "Planificamos, ejecutamos y medimos campañas publicitarias para maximizar tu retorno de inversión (ROI).",
    href: "/servicios/gestion-de-campanas"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: "easeOut"
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] // A gentle ease-out curve
    }
  },
};

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">Todo lo que necesitas para crecer</h2>
          <p className="mt-6 text-lg sm:text-xl text-foreground/70">
            Ofrecemos una gama completa de soluciones de marketing digital diseñadas para llevar tu negocio al siguiente nivel.
          </p>
        </AnimatedDiv>
        <AnimatedDiv
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <AnimatedDiv key={index} variants={itemVariants}>
              <Link href={service.href} className="h-full block group">
                <Card className="h-full flex flex-col bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                    <CardHeader>
                      {service.icon}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col pt-0">
                      <CardTitle className="font-headline text-2xl mb-3">{service.title}</CardTitle>
                      <CardDescription className="flex-grow text-base">{service.description}</CardDescription>
                      <div className="flex items-center text-primary mt-6 font-medium">
                          Saber más <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                </Card>
              </Link>
            </AnimatedDiv>
          ))}
           <AnimatedDiv variants={itemVariants}>
              <div className="h-full flex flex-col bg-card/50 border-border/50 rounded-lg p-8 items-center justify-center text-center">
                    <h3 className="font-headline text-2xl mb-3">¿Listo para empezar?</h3>
                    <p className="flex-grow text-base text-foreground/70 mb-6">Hablemos de cómo podemos ayudarte a alcanzar tus objetivos. ¡Agenda una sesión gratuita!</p>
                    <Button className="w-full" asChild>
                      <a href="#booking">Reservar Sesión Estratégica</a>
                    </Button>
              </div>
            </AnimatedDiv>
        </AnimatedDiv>
      </div>
    </section>
  );
};

export default Services;
