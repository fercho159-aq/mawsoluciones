import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import WhatsappIcon from '@/components/icons/whatsapp-icon';

type Service = {
  title: string;
  description: string;
  href: string;
  image: ImagePlaceholder | undefined;
};

const services: Service[] = [
  {
    title: 'Creación de Contenido',
    description:
      'Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca.',
    href: '/servicios/creacion-de-contenido',
    image: PlaceHolderImages.find(img => img.id === 'service-content-creation'),
  },
  {
    title: 'Desarrollo Web',
    description:
      'Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión.',
    href: '/servicios/desarrollo-web',
    image: PlaceHolderImages.find(img => img.id === 'service-web-development'),
  },
  {
    title: 'Producción de Foto/Video',
    description:
      'Producimos material audiovisual profesional que captura la esencia de tu marca y cuenta tu historia.',
    href: '/servicios/produccion-foto-video',
    image: PlaceHolderImages.find(img => img.id === 'service-photo-video'),
  },
  {
    title: 'Automatización de Marketing',
    description:
      'Implementamos sistemas de automatización para nutrir leads y optimizar tus embudos de venta.',
    href: '/servicios/automatizacion',
    image: PlaceHolderImages.find(img => img.id === 'service-automation'),
  },
  {
    title: 'Gestión de Campañas',
    description:
      'Planificamos, ejecutamos y medimos campañas publicitarias para maximizar tu retorno de inversión (ROI).',
    href: '/servicios/gestion-de-campanas',
    image: PlaceHolderImages.find(img => img.id === 'service-campaigns'),
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
              <Card
                key={index}
                className="h-full flex flex-col bg-card/50 hover:bg-card border-border/50 hover:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-sm hover:shadow-2xl overflow-hidden"
              >
                {service.image && (
                  <div className="relative aspect-video">
                    <Image
                      src={service.image.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                      data-ai-hint={service.image.imageHint}
                    />
                  </div>
                )}
                <CardContent className="flex-grow flex flex-col p-6">
                  <CardTitle className="font-headline text-2xl mb-3">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="flex-grow text-base mb-6">
                    {service.description}
                  </CardDescription>
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <Button asChild className="w-full">
                      <Link href={service.href}>
                        Ver más <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                        <WhatsappIcon className="w-4 h-4 mr-2" />
                        Contactar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
    