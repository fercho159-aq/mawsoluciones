import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DataAutomationCalculator from "@/components/data-automation-calculator";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold">
              Automatización y Desarrollo
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Unimos el poder de la automatización con el desarrollo a medida para crear sistemas inteligentes que conectan tus datos, optimizan tus flujos de trabajo y desbloquean nuevos niveles de eficiencia.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Tus Sistemas, Perfectamente Sincronizados.</h2>
              <p>
                ¿Cansado de copiar y pegar datos entre hojas de cálculo y tu CRM? ¿Tus sistemas no se hablan entre sí? Integramos tus herramientas existentes y desarrollamos conectores a medida para que tus datos fluyan sin fricción, automatizando procesos que antes requerían horas de trabajo manual.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Automatización con n8n:</strong> Conectamos tus apps favoritas (Google Sheets, Airtable, CRMs, etc.) para crear flujos de trabajo complejos sin una línea de código.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Conexión a Bases de Datos:</strong> Leemos y escribimos información directamente en tus bases de datos (SQL, NoSQL) desde nuestros flujos de automatización para una gestión centralizada.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>APIs a la Medida:</strong> Si no existe una integración, la construimos. Creamos APIs para conectar sistemas propietarios o aplicaciones legadas.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Dashboards en Tiempo Real:</strong> Centralizamos los datos de todas tus plataformas en un dashboard visual para que tomes decisiones informadas al instante.</span>
                </li>
              </ul>
            </div>
             <div className="relative aspect-square">
               <Image
                src="https://images.unsplash.com/photo-1696208261239-3f1e7a10a1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYXV0b21hdGlvbiUyMGFwaXxlbnwwfHx8fDE3NjIyMzE2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Automatización y Desarrollo"
                fill
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="data automation api"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Diagnóstico de Automatización de Datos</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Responde a este breve cuestionario para descubrir tu potencial de automatización y cómo podemos ayudarte.
            </p>
          </div>
          <DataAutomationCalculator />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para que tus datos trabajen para ti?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Elimina el trabajo manual, reduce errores y obtén una visión unificada de tu negocio. Hablemos de tu proyecto.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <Link href="/contacto">
                    Agendar una Consulta de Automatización <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
