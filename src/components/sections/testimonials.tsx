import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Lo que dicen nuestros clientes</h2>
          <p className="mt-4 text-lg text-foreground/80">
            El éxito de nuestros clientes es nuestro mayor orgullo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between shadow-lg">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
