import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import AnimatedDiv from "../animated-div";
import { Button } from "../ui/button";
import WhatsappIcon from "../icons/whatsapp-icon";

const testimonials = [
  {
    name: "Maria Garcia",
    company: "CEO de Innovatech",
    quote: "MAW Soluciones revolucionó nuestra presencia en línea. Su equipo es creativo, profesional y, lo más importante, entrega resultados. ¡Nuestras ventas aumentaron un 40%!",
    image: PlaceHolderImages.find(img => img.id === 'testimonial-1')
  },
  {
    name: "Juan Rodriguez",
    company: "Fundador de Café Rico",
    quote: "El desarrollo web y la estrategia de contenido superaron todas nuestras expectativas. Entendieron nuestra marca a la perfección y la llevaron al siguiente nivel.",
    image: PlaceHolderImages.find(img => img.id === 'testimonial-2')
  },
  {
    name: "Sofia Lopez",
    company: "Directora de Marketing en Moda Local",
    quote: "La producción de video fue espectacular. Han capturado la esencia de nuestra marca de una manera que conecta auténticamente con nuestra audiencia. ¡Totalmente recomendados!",
    image: PlaceHolderImages.find(img => img.id === 'testimonial-3')
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
        duration: 0.5,
        ease: "easeInOut"
    }
  },
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Lo que dicen nuestros clientes</h2>
          <p className="mt-4 text-lg text-foreground/80">
            El éxito de nuestros clientes es nuestro mayor orgullo.
          </p>
        </AnimatedDiv>
        <AnimatedDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {testimonials.map((testimonial, index) => (
            <AnimatedDiv key={index} variants={itemVariants}>
              <Card className="h-full flex flex-col justify-between shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="pt-6">
                  <blockquote className="text-foreground/80 italic">"{testimonial.quote}"</blockquote>
                </CardContent>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {testimonial.image && (
                      <Avatar>
                        <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.image.imageHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-foreground/70">{testimonial.company}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </AnimatedDiv>
          ))}
        </AnimatedDiv>

        <AnimatedDiv className="text-center mt-16">
          <h3 className="font-headline text-2xl sm:text-3xl font-bold">Conviértete en nuestro próximo caso de éxito</h3>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            ¿Listo para ver resultados reales? Hablemos de tu proyecto.
          </p>
          <Button size="lg" className="mt-8" variant="whatsapp" asChild>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="w-5 h-5 mr-2" />
              Chatea con un experto
            </a>
          </Button>
        </AnimatedDiv>

      </div>
    </section>
  );
};

export default Testimonials;
