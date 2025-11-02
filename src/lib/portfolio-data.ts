
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images";

export type PortfolioItemType = {
  id: string;
  title: string;
  category: string;
  image?: ImagePlaceholder;
  description: string;
  services: string[];
  website?: string;
  client: string;
  challenge: string;
  solution: string;
  parallaxImages?: {
    laptop: string;
    phone: string;
  };
};

export const portfolioItems: PortfolioItemType[] = [
  {
    id: "festival-cine-los-cabos",
    title: "Festival Internacional de Cine de Los Cabos: Una Plataforma Digital #BeyondTheScreen",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-ficc",
      description: "Feria del cine de los cabos",
      imageUrl: "/images/desarrollo web/1.png",
      imageHint: "movie festival website",
    },
    client: "Festival Internacional de Cine de Los Cabos (FICLosCabos)",
    description: "Desarrollamos el sitio web oficial para la 13ª edición del Festival Internacional de Cine de Los Cabos (FICLosCabos), creando un hub digital centralizado para asistentes, cineastas y patrocinadores, enfocado en la experiencia e innovación del festival.",
    challenge: "El FICLosCabos necesitaba una plataforma digital que no solo sirviera como un canal informativo para su 13ª edición, sino que también reflejara su evolución de un evento de cine a una \"plataforma creativa expandida\" bajo el concepto #BeyondTheScreen. El reto era integrar múltiples iniciativas clave —como el Fondo Fílmico Gabriel Figueroa, la nueva sección de Animación y la convocatoria \"La Baja Inspira\"— en una interfaz intuitiva, moderna y que facilitara la captación de asistentes mediante un sistema de pre-registro.",
    solution: "Diseñamos y desarrollamos un sitio web dinámico y visualmente impactante que captura la esencia del festival, donde convergen el cine, la música, el arte digital y la gastronomía. Implementamos una arquitectura de información clara que permite a los usuarios navegar fácilmente entre las distintas secciones, desde la programación hasta las convocatorias abiertas. Integramos un formulario de pre-registro prominente para maximizar la captación de interesados y optimizamos el sitio para comunicar eficazmente la visión #BeyondTheScreen, asegurando una experiencia de usuario fluida tanto en escritorio como en dispositivos móviles.",
    services: ["Diseño y Desarrollo Web", "Diseño de Experiencia de Usuario (UX) e Interfaz de Usuario (UI)", "Integración de Sistema de Gestión de Contenidos (CMS)", "Desarrollo de formularios de pre-registro y gestión de convocatorias", "Optimización Móvil (Responsive Design)"],
    website: "https://www.ficloscabos.org/",
    parallaxImages: {
      laptop: "/images/desarrollo web/2.png",
      phone: "/images/desarrollo web/4.png"
    }
  },
  {
    id: "fashion-brand-socials",
    title: "Redes Sociales para Marca de Moda",
    category: "Creación de Contenido",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-content-1'),
    client: "Chic & Co.",
    description: "Gestión integral de redes sociales para una marca de moda, enfocada en construir una comunidad y aumentar el engagement.",
    challenge: "Diferenciarse en el competitivo mundo de la moda en Instagram y TikTok. Era necesario crear una identidad visual fuerte y contenido que resonara con una audiencia joven y exigente.",
    solution: "Desarrollamos una estrategia de contenido basada en tres pilares: inspiración (looks y tendencias), educación (cuidado de las prendas) y comunidad (contenido generado por usuarios). Produjimos sesiones de fotos y videos de alta calidad y gestionamos colaboraciones con influencers.",
    services: ["Gestión de Redes Sociales", "Creación de Contenido", "Producción de Foto y Video"],
  },
  {
    id: "product-launch-video",
    title: "Video de Lanzamiento de Producto",
    category: "Producción de Video",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-video-1'),
    client: "Gadgetify",
    description: "Video promocional de alto impacto para el lanzamiento de un nuevo gadget tecnológico.",
    challenge: "Explicar las características innovadoras de un producto tecnológico complejo de una manera visualmente atractiva y fácil de entender en menos de 90 segundos.",
    solution: "Realizamos una producción de video completa, desde el guion y el storyboard hasta la postproducción con animación 3D. El resultado fue un video dinámico y cinemático que se utilizó en la campaña de lanzamiento, redes sociales y en la página de producto, contribuyendo a un lanzamiento exitoso.",
    services: ["Producción de Video", "Guion", "Animación 3D"],
  },
  {
    id: "ecommerce-automation",
    title: "Automatización para E-commerce",
    category: "Automatización",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-automation-1'),
    client: "Gourmet Box",
    description: "Implementación de flujos de automatización de marketing para un e-commerce de productos gourmet.",
    challenge: "Recuperar carritos abandonados, aumentar el valor de vida del cliente (LTV) y personalizar la comunicación con una base de datos de clientes en crecimiento.",
    solution: "Configuramos secuencias automatizadas de email para carritos abandonados, bienvenida a nuevos suscriptores, y campañas de up-selling y cross-selling basadas en el comportamiento de compra. Integramos el CRM con la plataforma de e-commerce para una segmentación avanzada.",
    services: ["Automatización de Marketing", "Email Marketing", "Integración de CRM"],
  },
  {
    id: "local-business-ads",
    title: "Campañas para Negocio Local",
    category: "Campañas",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-campaign-1'),
    client: "Sabor Urbano Restaurante",
    description: "Campañas de Google Ads y Social Ads para un restaurante local.",
    challenge: "Aumentar las reservas y la afluencia de clientes durante los días de semana, compitiendo con otros restaurantes de la zona.",
    solution: "Lanzamos campañas de Google Ads enfocadas en búsquedas locales (ej. 'restaurante cerca de mí') y campañas en Instagram y Facebook con segmentación geográfica y por intereses (ej. 'foodies'). Creamos anuncios atractivos con ofertas especiales para los días de menor afluencia, logrando un aumento del 30% en las reservas.",
    services: ["Gestión de Campañas", "Google Ads", "Social Ads"],
  },
  {
    id: "polar-autopartes",
    title: "Polar Autopartes: Digitalización de un Catálogo Complejo de Refacciones",
    category: "Desarrollo Web",
    image: {
        id: "portfolio-web-polar",
        description: "Polar autopartes website",
        imageUrl: "/images/desarrollo web/5.png",
        imageHint: "auto parts website"
    },
    client: "Polar Autopartes",
    description: "Desarrollamos la plataforma de e-commerce para Polar Autopartes, implementando un buscador de refacciones avanzado para conectar a talleres, refaccionarias y clientes particulares con el inventario exacto para el sistema de enfriamiento de sus vehículos.",
    challenge: "Polar Autopartes, con más de 20 años de experiencia, enfrentaba el reto de digitalizar un inventario masivo y altamente específico. El éxito del proyecto dependía de crear un sistema donde un usuario pudiera encontrar una pieza exacta (como una bomba de agua o un radiador) entre miles de opciones, filtrando por Marca, Modelo, Año y Motor. El sitio debía ser rápido, confiable y generar confianza tanto para compradores B2B como para el consumidor final.",
    solution: "Construimos un sitio de e-commerce robusto centrado en un potente motor de \"Búsqueda Avanzada\". Esta herramienta se convirtió en el núcleo del sitio, permitiendo a los usuarios filtrar con precisión el catálogo completo y encontrar la pieza compatible sin errores. Diseñamos una interfaz limpia que organiza los productos por líneas principales (Bombas de Agua, Depósitos, etc.) y destacamos sus fortalezas clave: cobertura nacional, envío rápido y calidad garantizada, todo respaldado por testimonios de clientes reales para solidificar su reputación líder en el sector.",
    services: ["Diseño y Desarrollo de E-commerce", "Implementación de Catálogo Digital Complejo", "Desarrollo de Buscador de Productos por Filtros (Marca, Modelo, Año, Motor)", "Diseño de Experiencia de Usuario (UX) e Interfaz de Usuario (UI)", "Optimización para Dispositivos Móviles (Responsive Design)"],
    website: "https://www.polarautopartes.com/",
    parallaxImages: {
      laptop: "/images/desarrollo web/6.png",
      phone: "/images/desarrollo web/8.png"
    }
  }
];
