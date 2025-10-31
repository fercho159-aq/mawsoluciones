import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, CodeXml, Camera, Bot, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const services = [
  {
    icon: <PenSquare className="w-8 h-8 text-primary" />,
    title: "Creación de Contenido",
    description: "Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca.",
    href: "/servicios/creacion-de-contenido"
  },
  {
    icon: <CodeXml className="w-8 h-8 text-primary" />,
    title: "Desarrollo Web",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión.",
    href: "/servicios/desarrollo-web"
  },
  {
    icon: <Camera className="w-8 h-8 text-primary" />,
    title: "Producción de Foto/Video",
    description: "Producimos material audiovisual profesional que captura la esencia de tu marca y cuenta tu historia.",
    href: "/servicios/produccion-foto-video"
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "Automatización",
    description: "Implementamos sistemas de automatización de marketing para nutrir leads y optimizar tus embudos de venta.",
    href: "/servicios/automatizacion"
  },
  {
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    title: "Gestión de Campañas",
    description: "Planificamos, ejecutamos y medimos campañas publicitarias para maximizar tu ROI.",
    href: "/servicios/gestion-de-campanas"
  },
  {
    icon: <ArrowRight className="w-8 h-8 text-primary" />,
    title: "¿Listo para empezar?",
    description: "Hablemos de cómo podemos ayudarte a alcanzar tus objetivos. ¡Agenda una sesión gratuita!"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Nuestros Servicios</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Ofrecemos una gama completa de soluciones de marketing digital para llevar tu negocio al éxito.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                <CardHeader>
                  {service.icon}
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <CardTitle className="font-headline text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="flex-grow">{service.description}</CardDescription>
                  {service.href ? (
                    <Button variant="link" className="p-0 mt-4 self-start" asChild>
                      <Link href={service.href}>
                        Saber más <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button className="mt-4 w-full" asChild>
                      <a href="#booking">Reservar Sesión</a>
                    </Button>
                  )}
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;