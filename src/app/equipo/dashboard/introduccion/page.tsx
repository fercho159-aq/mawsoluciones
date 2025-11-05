import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Placeholder para el contenido del e-learning
const introSections = [
    { title: "Introducción al Desarrollo Web", description: "Conceptos clave, nuestro stack tecnológico y el proceso de un proyecto web.", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Introducción a la Creación de Contenido", description: "Nuestra metodología para crear estrategias de contenido, formatos y medición.", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Introducción a la Gestión de Campañas (Ads)", description: "Principios de Google Ads, Meta Ads y cómo gestionamos los presupuestos.", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Introducción a la Automatización", description: "Herramientas que usamos (como n8n) y tipos de automatizaciones que implementamos.", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
];

export default function IntroduccionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Introducción a los Servicios</h1>
      <p className="mb-8 text-foreground/80">Aquí encontrarás una introducción a cada uno de nuestros servicios principales. Es fundamental que cada miembro del equipo comprenda las bases de lo que ofrecemos para mantener una comunicación coherente y de alta calidad.</p>
       <div className="grid md:grid-cols-2 gap-6">
        {introSections.map(section => (
            <Card key={section.title} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-foreground/80">{section.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                    <a href={section.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline flex items-center">
                        Ver video de introducción <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
