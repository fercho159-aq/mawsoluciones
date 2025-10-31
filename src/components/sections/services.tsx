import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, CodeXml, Camera, Bot, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const services = [
  {
    icon: <PenSquare className="w-8 h-8 text-primary" />,
    title: "Creación de Contenido",
    description: "Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca."
  },
  {
    icon: <CodeXml className="w-8 h-8 text-primary" />,
    title: "Desarrollo Web",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión."
  },
  {
    icon: <Camera className="w-8 h-8 text-primary" />,
    title: "Producción de Foto/Video",
    description: "Producimos material audiovisual profesional que captura la esencia de tu marca y cuenta tu historia."
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "Automatización",
    description: "Implementamos sistemas de automatización de marketing para nutrir leads y optimizar tus embudos de venta."
  },
  {
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    title: "Gestión de Campañas",
    description: "Planificamos, ejecutamos y medimos campañas publicitarias en plataformas clave para maximizar tu ROI."
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
                {index === services.length - 1 && (
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
