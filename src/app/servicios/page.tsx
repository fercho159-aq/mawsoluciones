import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  PenSquare,
  CodeXml,
  Camera,
  Bot,
  Megaphone,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <PenSquare className="w-10 h-10 text-primary" />,
    title: 'Creación de Contenido',
    description:
      'Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca.',
    href: '/servicios/creacion-de-contenido',
  },
  {
    icon: <CodeXml className="w-10 h-10 text-primary" />,
    title: 'Desarrollo Web',
    description:
      'Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión.',
    href: '/servicios/desarrollo-web',
  },
  {
    icon: <Camera className="w-10 h-10 text-primary" />,
    title: 'Producción de Foto/Video',
    description:
      'Producimos material audiovisual profesional que captura la esencia de tu marca y cuenta tu historia.',
    href: '/servicios/produccion-foto-video',
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: 'Automatización de Marketing',
    description:
      'Implementamos sistemas de automatización para nutrir leads y optimizar tus embudos de venta.',
    href: '/servicios/automatizacion',
  },
  {
    icon: <Megaphone className="w-10 h-10 text-primary" />,
    title: 'Gestión de Campañas',
    description:
      'Planificamos, ejecutamos y medimos campañas publicitarias para maximizar tu retorno de inversión (ROI).',
    href: '/servicios/gestion-de-campanas',
  },
];

const ServicesPage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
              Nuestros Servicios
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Ofrecemos una gama completa de soluciones de marketing digital
              diseñadas para llevar tu negocio al siguiente nivel. Explora
              nuestros servicios para encontrar el que mejor se adapte a tus
              necesidades.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="h-full block group"
              >
                <Card className="h-full flex flex-col bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                  <CardHeader>{service.icon}</CardHeader>
                  <CardContent className="flex-grow flex flex-col pt-0">
                    <CardTitle className="font-headline text-2xl mb-3">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="flex-grow text-base">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center text-primary mt-6 font-medium">
                      Saber más{' '}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
