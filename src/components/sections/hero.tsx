import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="py-24 sm:py-32 md:py-40 bg-card">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Transformamos Ideas en Resultados Digitales
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
            Somos MAW Soluciones, tu socio estratégico en marketing digital. Impulsamos tu marca al siguiente nivel con creatividad, tecnología y datos.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#booking">Reserva tu Sesión Estratégica</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#portfolio">Ver Proyectos</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
