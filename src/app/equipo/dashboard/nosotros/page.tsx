import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder para el contenido del e-learning
const nosotrosSections = [
    { title: "Nuestra Historia y Misión", content: "Aquí irá el contenido sobre la historia, misión y visión de MAW Soluciones." },
    { title: "Nuestros Valores", content: "Descripción de los valores que nos guían como equipo." },
    { title: "Cultura de Trabajo y Trato con el Cliente", content: "Guía sobre cómo nos comunicamos interna y externamente." },
    { title: "Servicios que Ofrecemos", content: "Un resumen de alto nivel de cada uno de nuestros servicios." },
];

export default function NosotrosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Sobre Nosotros</h1>
      <div className="grid gap-6">
        {nosotrosSections.map(section => (
            <Card key={section.title}>
                <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80">{section.content}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
