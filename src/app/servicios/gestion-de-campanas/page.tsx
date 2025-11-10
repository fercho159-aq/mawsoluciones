import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AdCalculator from "@/components/ad-calculator";
import MetaAdLibrary from "@/components/meta-ad-library";

const ServicePage = () => {
  return (
    <div className="bg-background">
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold">
              Gestión de Campañas Publicitarias
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80">
              Planificamos, ejecutamos, medimos y optimizamos campañas publicitarias en plataformas clave para maximizar tu retorno de inversión (ROI) y alcanzar tus objetivos de negocio.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground/80">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Inversión Inteligente, Resultados Reales</h2>
              <p>
                La publicidad digital bien ejecutada es una de las formas más rápidas de hacer crecer tu negocio. En MAW Soluciones, vamos más allá de simplemente lanzar anuncios. Adoptamos un enfoque basado en datos para asegurar que cada dólar invertido trabaje para ti.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Google Ads y SEM:</strong> Capturamos la demanda existente y ponemos tu negocio frente a clientes que ya están buscando tus soluciones.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Social Ads (Meta, LinkedIn, TikTok):</strong> Creamos demanda y construimos reconocimiento de marca llegando a audiencias hiper-segmentadas.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Optimización Continua (CRO):</strong> Analizamos el rendimiento de tus campañas en tiempo real y realizamos ajustes para mejorar constantemente el ROI.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Informes Transparentes:</strong> Te mantenemos informado con reportes claros y concisos que demuestran el impacto real de tu inversión.</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[9/16] max-w-sm mx-auto w-full rounded-lg overflow-hidden shadow-xl">
               <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/-y87ZmqVozI"
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
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Calcula tu Presupuesto y Alcance</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Usa nuestra herramienta interactiva para obtener una estimación de tu próxima campaña publicitaria en minutos.
            </p>
          </div>
          <AdCalculator />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Analiza a tu Competencia</h2>
            <p className="mt-4 text-lg text-foreground/80">
              Espía los anuncios que están usando tus competidores. Introduce el nombre de una marca y descubre su estrategia en la Biblioteca de Anuncios de Meta.
            </p>
          </div>
          <MetaAdLibrary />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Listo para acelerar tu crecimiento?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Hablemos de cómo nuestras campañas pueden llevar tu negocio al siguiente nivel.
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
