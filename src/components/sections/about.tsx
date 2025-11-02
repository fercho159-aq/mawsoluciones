import AnimatedDiv from "../animated-div";
import { Button } from "../ui/button";
import WhatsappIcon from "../icons/whatsapp-icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const whyHireUsPoints = [
  {
    title: "Experiencia y Conocimiento Especializado",
    description: "Accede a un equipo de profesionales en SEO, contenido, publicidad y más, sin el coste de contratarlos individualmente. Nos mantenemos al día de las últimas tendencias para que tú no tengas que hacerlo.",
    image: PlaceHolderImages.find(p => p.id === 'service-web-development')
  },
  {
    title: "Ahorro de Tiempo y Dinero",
    description: "Contratar una agencia es más rentable que formar un equipo de marketing interno. Ahorra en salarios, formación y en las costosas herramientas profesionales que nosotros ya tenemos.",
    image: PlaceHolderImages.find(p => p.id === 'service-campaigns')
  },
  {
    title: "Resultados Medibles y ROI",
    description: "Nos enfocamos en los datos. Tomamos decisiones basadas en análisis para optimizar continuamente tus campañas y demostrar un retorno de inversión claro y tangible para tu negocio.",
    image: {
      id: "blog-seo",
      description: "Person working on a laptop with charts",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxTRU98ZW58MHx8fHwxNzYyMTk4ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "analytics dashboard"
    }
  },
  {
    title: "Enfoque en tu Negocio",
    description: "Delega el marketing a los expertos y libera tu tiempo para centrarte en lo que mejor sabes hacer: dirigir y hacer crecer tu negocio. Nosotros nos encargamos de traerte los clientes.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-2')
  }
];


const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">¿Por qué contratar una Agencia de Marketing?</h2>
          <p className="mt-4 text-lg text-foreground/80">
            En un mundo digital que cambia constantemente, un socio estratégico es tu mayor ventaja competitiva.
          </p>
        </AnimatedDiv>
        
        <AnimatedDiv>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {whyHireUsPoints.map((point, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col group overflow-hidden">
                        {point.image && (
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={point.image.imageUrl}
                              alt={point.title}
                              fill
                              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                              data-ai-hint={point.image.imageHint}
                            />
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col flex-grow">
                          <h3 className="font-headline text-2xl font-bold mb-4">{point.title}</h3>
                          <p className="text-foreground/80 flex-grow">{point.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:inline-flex" />
              <CarouselNext className="hidden lg:inline-flex" />
            </Carousel>
        </AnimatedDiv>

        <AnimatedDiv className="text-center mt-20">
          <h3 className="font-headline text-2xl sm:text-3xl font-bold">Únete a nuestra historia de éxito</h3>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Nos encantaría conocer tu proyecto y ayudarte a escribir el próximo capítulo.
          </p>
          <Button size="lg" className="mt-8" variant="whatsapp" asChild>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="w-5 h-5 mr-2" />
              Contáctanos por WhatsApp
            </a>
          </Button>
        </AnimatedDiv>
      </div>
    </section>
  )
}

export default About;
