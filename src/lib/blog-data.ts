import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export type BlogPostType = {
  id: string;
  slug: string;
  title: string;
  category: string;
  image?: ImagePlaceholder;
  excerpt: string;
  date: string;
  author: string;
  content: string;
};

export const blogPosts: BlogPostType[] = [
  {
    id: "seo-para-principiantes",
    slug: "seo-para-principiantes",
    title: "Guía de SEO para Principiantes en 2024",
    category: "SEO",
    image: PlaceHolderImages.find(img => img.id === 'blog-seo'),
    excerpt: "Descubre los fundamentos del SEO y cómo puedes empezar a optimizar tu sitio web para aparecer en los primeros resultados de Google.",
    date: "2024-07-15T10:00:00.000Z",
    author: "Ana Pérez",
    content: `
      <p>El SEO (Search Engine Optimization) es el proceso de mejorar la visibilidad de un sitio web en los resultados orgánicos de los diferentes buscadores. Es una disciplina fundamental en el marketing digital.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">¿Por qué es importante el SEO?</h3>
      <p>La mayoría de los usuarios de internet encuentran nuevos sitios a través de los motores de búsqueda. Aparecer en las primeras posiciones para las búsquedas relevantes para tu negocio puede significar un flujo constante de tráfico cualificado.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Conceptos Clave</h3>
      <ul>
        <li><strong>Palabras Clave (Keywords):</strong> Los términos que los usuarios introducen en los buscadores.</li>
        <li><strong>SEO On-Page:</strong> Optimización de los elementos dentro de tu propio sitio web (contenido, meta tags, etc.).</li>
        <li><strong>SEO Off-Page:</strong> Acciones fuera de tu sitio web para mejorar su autoridad (ej. link building).</li>
        <li><strong>SEO Técnico:</strong> Aspectos técnicos que ayudan a los motores de búsqueda a rastrear e indexar tu sitio eficientemente.</li>
      </ul>
      <blockquote class="mt-6 border-l-4 border-primary pl-4 italic text-foreground/90">
        "El mejor lugar para esconder un cadáver es la segunda página de resultados de Google."
      </blockquote>
      <p class="mt-6">Empezar con SEO puede parecer abrumador, pero centrarse en crear contenido de alta calidad que responda a las preguntas de tu audiencia es siempre el mejor primer paso.</p>
    `
  },
  {
    id: "poder-del-contenido-visual",
    slug: "poder-del-contenido-visual",
    title: "El Poder del Contenido Visual en Redes Sociales",
    category: "Redes Sociales",
    image: PlaceHolderImages.find(img => img.id === 'blog-visual-content'),
    excerpt: "Las imágenes y los videos no son solo un complemento, son el núcleo de una estrategia de redes sociales exitosa. Aprende por qué y cómo usarlo.",
    date: "2024-07-10T11:30:00.000Z",
    author: "Carlos Gómez",
    content: `
      <p>En la era de la sobrecarga de información, el contenido visual es tu mejor aliado para captar la atención. El cerebro humano procesa las imágenes 60,000 veces más rápido que el texto.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Beneficios del Contenido Visual</h3>
      <ul>
        <li>Aumenta el 'engagement' (interacción).</li>
        <li>Mejora la retención del mensaje.</li>
        <li>Fomenta que el contenido se comparta más.</li>
        <li>Humaniza tu marca y construye confianza.</li>
      </ul>
      <p class="mt-6">No se trata solo de publicar imágenes bonitas. Tu contenido visual debe ser coherente con tu identidad de marca, aportar valor y estar adaptado a cada plataforma (Reels en Instagram, videos cortos en TikTok, infografías en LinkedIn, etc.).</p>
    `
  },
  {
    id: "automatizacion-email-marketing",
    slug: "automatizacion-email-marketing",
    title: "5 Flujos de Email Marketing Automatizado que Debes Implementar",
    category: "Automatización",
    image: PlaceHolderImages.find(img => img.id === 'blog-email-automation'),
    excerpt: "Ahorra tiempo, personaliza la comunicación y aumenta tus ventas con estos 5 flujos de trabajo de email marketing automatizado.",
    date: "2024-07-05T09:00:00.000Z",
    author: "Sofía Martínez",
    content: `
      <p>El email marketing sigue siendo uno de los canales con mayor ROI. La automatización te permite llevarlo al siguiente nivel.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Flujos Esenciales:</h3>
      <ol>
        <li><strong>Secuencia de Bienvenida:</strong> Nutre a tus nuevos suscriptores desde el primer día.</li>
        <li><strong>Recuperación de Carrito Abandonado:</strong> Recupera ventas que dabas por perdidas.</li>
        <li><strong>Felicitación de Cumpleaños:</strong> Fideliza a tus clientes con un detalle personal.</li>
        <li><strong>Campaña de Reactivación:</strong> Vuelve a conectar con suscriptores inactivos.</li>
        <li><strong>Up-selling y Cross-selling Post-Compra:</strong> Aumenta el valor de vida de tus clientes.</li>
      </ol>
      <p class="mt-6">Implementar estos flujos no solo mejora la eficiencia, sino que también crea una experiencia mucho más relevante y personalizada para tus contactos.</p>
    `
  },
  {
    id: "como-crear-una-pagina-web",
    slug: "como-crear-una-pagina-web-exitosa",
    title: "Cómo Crear una Página Web Exitosa para tu Negocio",
    category: "Desarrollo Web",
    image: PlaceHolderImages.find(img => img.id === 'blog-website'),
    excerpt: "Tu sitio web es tu principal activo digital. Sigue estos pasos para asegurarte de que sea una herramienta poderosa para tu negocio.",
    date: "2024-06-28T14:00:00.000Z",
    author: "Laura Fernández",
    content: `
      <p>Tener un sitio web es crucial, pero tener uno que de verdad genere resultados requiere estrategia y planificación.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Pasos Clave:</h3>
      <ul>
        <li><strong>Define tus objetivos:</strong> ¿Qué quieres lograr? (ventas, leads, etc.).</li>
        <li><strong>Conoce a tu audiencia:</strong> ¿A quién te diriges?</li>
        <li><strong>Diseño y Experiencia de Usuario (UI/UX):</strong> Debe ser intuitivo, atractivo y fácil de usar.</li>
        <li><strong>Rendimiento y Velocidad:</strong> Un sitio lento aleja a los visitantes.</li>
        <li><strong>Llamadas a la Acción (CTAs):</strong> Guía al usuario hacia lo que quieres que haga.</li>
        <li><strong>Optimización para Móviles:</strong> La mayoría de usuarios navegará desde su teléfono.</li>
      </ul>
      <p class="mt-6">Recuerda que tu sitio web no es un proyecto con un final, sino una herramienta en constante evolución. Analiza su rendimiento y optimízalo continuamente.</p>
    `
  }
];
