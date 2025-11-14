import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomDevRoiCalculator from "@/components/custom-dev-roi-calculator";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold">
              Desarrollo a la Medida
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Creamos soluciones de software, aplicaciones y sistemas personalizados que se adaptan perfectamente a tus procesos, eliminando cuellos de botella y dándote una ventaja competitiva única.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative aspect-square">
               <Image
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBzb2Z0d2FyZXxlbnwwfHx8fDE3NjIyMzE2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Desarrollo a la medida"
                fill
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="custom software"
              />
            </div>
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Software que Trabaja para Ti, no al Revés.</h2>
              <p>
                Mientras que el software estándar te obliga a adaptar tus procesos a sus limitaciones, una solución a medida se construye alrededor de tu forma única de trabajar. Optimizamos tus operaciones, automatizamos tareas complejas y te proporcionamos las herramientas exactas que tu equipo necesita para ser más eficiente.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>CRMs y ERPs Personalizados:</strong> Gestiona tus clientes y recursos con un sistema hecho para tu flujo de trabajo.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Aplicaciones Web y Móviles:</strong> Creamos herramientas internas o aplicaciones para clientes que solucionan problemas específicos.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Integraciones y APIs:</strong> Conectamos tus sistemas existentes (CRM, contabilidad, etc.) para que hablen entre sí, eliminando la entrada manual de datos.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Plataformas y Dashboards:</strong> Visualiza tus datos más importantes en un panel de control centralizado y toma mejores decisiones.</span>
                </li>
              </ul>
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
