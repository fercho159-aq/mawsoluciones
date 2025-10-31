
const timelineEvents = [
  {
    year: "2019",
    title: "Nacimiento de MAW Soluciones",
    description: "Fundamos la agencia con la misión de ayudar a las pequeñas empresas a crecer en el mundo digital."
  },
  {
    year: "2020",
    title: "Primer Gran Cliente",
    description: "Logramos nuestro primer contrato importante, validando nuestro modelo de negocio y nuestra pasión."
  },
  {
    year: "2021",
    title: "Expansión del Equipo",
    description: "Crecimos de 2 a 10 expertos en marketing, desarrollo y diseño."
  },
  {
    year: "2022",
    title: "Nuevos Servicios",
    description: "Lanzamos nuestros servicios de producción de video y automatización de marketing."
  },
  {
    year: "2024",
    title: "Reconocimiento de la Industria",
    description: "Recibimos el premio 'Agencia Digital del Año' por nuestro enfoque innovador y resultados probados."
  }
]

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Nuestra Trayectoria</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Un viaje de pasión, crecimiento e innovación constante.
          </p>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-3 sm:left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative mb-12">
              <div className="flex items-center">
                <div className="hidden sm:flex w-1/2">
                  {index % 2 === 0 && <TimelineCard {...event} alignment="left" />}
                </div>
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-primary rounded-full ring-4 ring-background absolute left-3 sm:left-1/2 -translate-x-1/2">
                </div>
                <div className="w-full sm:w-1/2 sm:pl-8">
                  {index % 2 !== 0 && <TimelineCard {...event} alignment="right" />}
                   <div className="block sm:hidden ml-8">
                     <TimelineCard {...event} alignment="right" />
                   </div>
                </div>
              </div>
               <div className="block sm:hidden mt-4">
                  {index % 2 === 0 && (
                    <div className="ml-8"><TimelineCard {...event} alignment="right" /></div>
                  )}
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TimelineCard = ({ year, title, description, alignment }: { year: string, title: string, description: string, alignment: 'left' | 'right' }) => (
  <div className={`w-full ${alignment === 'left' ? 'sm:text-right sm:pr-8' : ''}`}>
    <p className="text-sm font-semibold text-primary">{year}</p>
    <h3 className="font-headline text-xl font-bold mt-1">{title}</h3>
    <p className="mt-2 text-foreground/70">{description}</p>
  </div>
)

export default About;
