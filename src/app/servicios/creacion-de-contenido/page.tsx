import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold">
              Creación de Contenido
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Creamos contenido atractivo, relevante y de alta calidad que resuena con tu audiencia, fortalece tu marca y genera resultados medibles.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Del Concepto a la Conexión</h2>
              <p>
                En MAW Soluciones, entendemos que el contenido es el corazón de la comunicación digital. No se trata solo de publicar, sino de crear valor, educar, entretener y, en última instancia, construir una relación sólida y duradera con tu público.
              </p>
              <p>
                Nuestro equipo de creativos, redactores y estrategas colabora para producir contenido que no solo capta la atención, sino que también impulsa la acción.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Estrategia de Contenidos:</strong> Analizamos tu audiencia y objetivos para crear un plan de contenidos a medida.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Redacción SEO:</strong> Artículos de blog, landing pages y textos web optimizados para posicionar en buscadores.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Gestión de Redes Sociales:</strong> Contenido visual y escrito para Instagram, Facebook, LinkedIn y más, diseñado para generar engagement.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Email Marketing:</strong> Newsletters y secuencias de correo que convierten suscriptores en clientes.</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square">
               <Image
                src="https://images.unsplash.com/photo-1559526324-c1f275fbfa32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjb250ZW50JTIwY3JlYXRpb258ZW58MHx8fHwxNzYyMDkzMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Creación de Contenido"
                fill
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="content creation"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para contar tu historia?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Permítenos ayudarte a crear contenido que conecte y convierta.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <Link href="/contacto">
                    Reserva tu Sesión Estratégica <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
