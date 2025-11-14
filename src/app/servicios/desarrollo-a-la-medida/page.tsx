import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomDevRoiCalculator from "@/components/custom-dev-roi-calculator";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold">
              Desarrollo a la Medida
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Creamos soluciones de software y sistemas que se adaptan a tus procesos, eliminando cuellos de botella y dándote una ventaja competitiva.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Software que Trabaja para Ti.</h2>
              <p>
                Una solución a medida se construye alrededor de tu forma única de trabajar, optimizando tus operaciones.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>CRMs y ERPs a Medida:</strong> Gestiona clientes y recursos con un sistema hecho para tu flujo.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Apps Web y Móviles:</strong> Herramientas internas o para clientes que solucionan problemas específicos.</span>
                </li>
              </ul>
            </div>
             <div className="relative aspect-[9/16] max-w-sm mx-auto w-full rounded-lg overflow-hidden shadow-xl">
               <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/UMw2F8fIvF4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Calcula el ROI de tu Inversión</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Descubre cuánto tiempo y dinero podrías ahorrar anualmente con una solución de software a medida.
            </p>
          </div>
          <CustomDevRoiCalculator />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para construir tu ventaja competitiva?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Hablemos sobre cómo una solución de software a medida puede transformar tu operación y escalar tu negocio.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <Link href="/contacto">
                    Agenda una Consulta Gratuita <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
