import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export type InterviewPostType = {
  id: string;
  slug: string;
  title: string;
  category: "Entrevistas";
  image?: ImagePlaceholder;
  excerpt: string;
  date: string;
  author: string;
  content: string;
};

export const interviews: InterviewPostType[] = [
  {
    id: "entrevista-cafe-globo-ia",
    slug: "entrevista-cafe-globo-ia",
    title: "¿Cuáles son las mejores herramientas de Inteligencia Artificial?",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-cafe-globo'),
    excerpt: "Una charla con Café Globo donde exploramos las herramientas de IA que están revolucionando el marketing y los negocios en la actualidad.",
    date: "2024-06-25T10:00:00.000Z",
    author: "Café Globo",
    content: `
      <p>En el vertiginoso mundo del marketing digital, la inteligencia artificial se ha consolidado como un aliado indispensable. En esta entrevista exclusiva con Café Globo, desglosamos cuáles son las herramientas de IA más potentes del momento y cómo las empresas pueden integrarlas para optimizar procesos, personalizar la comunicación y, en última instancia, potenciar sus resultados. Desde la creación de contenido hasta el análisis predictivo, descubre el arsenal tecnológico que está definiendo el futuro.</p>
    `
  },
  {
    id: "podcast-giovanny-valencia-ventas",
    slug: "podcast-giovanny-valencia-ventas",
    title: "Estrategias de venta | Podcast con Giovanny Valencia",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-giovanny-valencia'),
    excerpt: "Giovanny Valencia nos comparte en este podcast sus estrategias de venta más efectivas y cómo adaptar las técnicas clásicas a la era digital para cerrar más tratos.",
    date: "2024-06-20T10:00:00.000Z",
    author: "Giovanny Valencia",
    content: `
      <p>¿Vender es un arte o una ciencia? Para Giovanny Valencia, es una combinación de ambas. En este episodio de nuestro podcast, el experto en ventas nos revela las estrategias que le han permitido triunfar en mercados competitivos. Hablamos sobre la psicología del comprador, la importancia de la escucha activa y cómo la tecnología puede potenciar al vendedor en lugar de reemplazarlo. Una clase magistral para cualquier profesional que busque mejorar sus habilidades comerciales.</p>
    `
  },
  {
    id: "entrevista-cafe-con-canela-bots",
    slug: "entrevista-cafe-con-canela-bots",
    title: "¿Es correcto hacer uso de bots? | Entrevista con Café con Canela TV",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-cafe-canela-bots'),
    excerpt: "Analizamos los pros y contras de la automatización en la atención al cliente. Una conversación con Café con Canela TV sobre el balance entre eficiencia y humanidad.",
    date: "2024-06-15T10:00:00.000Z",
    author: "Café con Canela TV",
    content: `
      <p>Los chatbots y la automatización prometen eficiencia 24/7, pero ¿a qué costo? En esta provocadora entrevista con Café con Canela TV, debatimos sobre el uso ético y estratégico de los bots en la interacción con el cliente. Exploramos cuándo un bot es la solución perfecta y cuándo una respuesta humana es insustituible. Descubre cómo implementar la automatización sin sacrificar la conexión y lealtad de tu audiencia.</p>
    `
  },
  {
    id: "entrevista-cafe-con-canela-dinero",
    slug: "entrevista-cafe-con-canela-dinero",
    title: "¿Cómo generar dinero en redes sociales? | Entrevista con Café con Canela",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-cafe-canela-money'),
    excerpt: "Café con Canela nos desvela los modelos de negocio más rentables en redes sociales, desde marketing de afiliados hasta la creación de productos digitales.",
    date: "2024-06-10T10:00:00.000Z",
    author: "Café con Canela",
    content: `
      <p>Monetizar una audiencia en redes sociales es el sueño de muchos, pero la realidad de pocos. En esta entrevista, el equipo de Café con Canela nos guía a través de las estrategias prácticas para convertir seguidores en ingresos. Hablamos de diversificación, la importancia de crear una marca personal sólida y cómo identificar las oportunidades de monetización que mejor se alinean con tu contenido y tu comunidad. Una guía esencial para creadores y emprendedores digitales.</p>
    `
  },
  {
    id: "podcast-lucero-trejo",
    slug: "podcast-lucero-trejo",
    title: "Lucero Trejo en Marketing y negocios",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-lucero-trejo'),
    excerpt: "Lucero Trejo se une a nuestro podcast para hablar sobre la construcción de marcas con propósito y cómo la narrativa auténtica es la mejor herramienta de marketing.",
    date: "2024-06-05T10:00:00.000Z",
    author: "Lucero Trejo",
    content: `
      <p>En un mercado saturado, las marcas que ganan son las que tienen una historia que contar. Lucero Trejo, estratega de marca y narrativa, nos explica en este podcast por qué el 'propósito' es el activo más valioso de una empresa. Analizamos casos de éxito, errores comunes y el paso a paso para construir una marca que no solo venda productos, sino que cree una comunidad leal y apasionada. Una charla inspiradora sobre el poder del storytelling en los negocios.</p>
    `
  },
  {
    id: "podcast-nizme-lleras",
    slug: "podcast-nizme-lleras",
    title: "Nizme Lleras en Marketing y negocios",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-nizme-lleras'),
    excerpt: "Conversamos con Nizme Lleras sobre el futuro del e-commerce, la optimización de la conversión y las claves para crear una experiencia de compra online inolvidable.",
    date: "2024-05-30T10:00:00.000Z",
    author: "Nizme Lleras",
    content: `
      <p>Tener una tienda online es solo el primer paso. ¿Cómo convertir visitantes en clientes? Nizme Lleras, experta en optimización de la tasa de conversión (CRO), nos comparte sus secretos en este episodio. Hablamos de la psicología del diseño, la importancia de las pruebas A/B y las pequeñas mejoras que pueden duplicar tus ventas. Una guía práctica para cualquier dueño de un e-commerce que busque resultados tangibles.</p>
    `
  },
  {
    id: "podcast-giovanna-venegas",
    slug: "podcast-giovanna-venegas",
    title: "Giovanna Venegas en Marketing y negocios",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-giovanna-venegas'),
    excerpt: "Giovanna Venegas nos introduce al mundo del marketing de afiliados y cómo crear flujos de ingreso pasivo a través de la recomendación de productos.",
    date: "2024-05-25T10:00:00.000Z",
    author: "Giovanna Venegas",
    content: `
      <p>¿Es posible ganar dinero mientras duermes? Giovanna Venegas, especialista en marketing de afiliados, dice que sí. En este podcast, desmitificamos el concepto de 'ingreso pasivo' y exploramos cómo el marketing de afiliados puede ser una fuente de ingresos viable para creadores de contenido y nichos de mercado. Descubre cómo elegir los productos correctos, construir confianza con tu audiencia y crear un sistema que trabaje para ti.</p>
    `
  },
  {
    id: "podcast-yordani",
    slug: "podcast-yordani",
    title: "Yordani en Marketing y negocios",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-yordani'),
    excerpt: "Yordani, analista de datos, nos explica cómo usar la información para tomar mejores decisiones de marketing, desde la segmentación de audiencias hasta la medición del ROI.",
    date: "2024-05-20T10:00:00.000Z",
    author: "Yordani",
    content: `
      <p>En el marketing moderno, los datos son el nuevo petróleo. Pero, ¿cómo los usamos sin ahogarnos en ellos? Yordani, experto en analítica digital, nos enseña a pensar como un científico de datos. En este episodio, aprenderás a identificar las métricas que realmente importan, a interpretar los resultados de tus campañas y a usar los insights para tomar decisiones más inteligentes y rentables. Una charla fundamental para dejar de adivinar y empezar a medir.</p>
    `
  },
  {
    id: "podcast-evelyn-cantu",
    slug: "podcast-evelyn-cantu",
    title: "Evelyn Cantú en Marketing y negocios",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-evelyn-cantu'),
    excerpt: "La creadora de contenido Evelyn Cantú nos revela sus secretos para construir una comunidad engagada en redes sociales y colaborar exitosamente con marcas.",
    date: "2024-05-15T10:00:00.000Z",
    author: "Evelyn Cantú",
    content: `
      <p>Con millones de seguidores, Evelyn Cantú ha dominado el arte de la creación de contenido. En esta conversación, nos comparte su viaje, desde sus inicios hasta convertirse en una de las influencers más reconocidas. Hablamos de la disciplina detrás de la creatividad, la importancia de la autenticidad y cómo negociar colaboraciones con marcas de manera profesional. Un vistazo único a la mente de una creadora de contenido de primer nivel.</p>
    `
  }
];
