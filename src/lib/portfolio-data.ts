import { PlaceHolderImages } from "@/lib/placeholder-images";

export type PortfolioItemType = {
  id: string;
  title: string;
  category: string;
  image?: {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
  };
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
    id: "tech-startup-website",
    title: "Sitio Web para Startup Tecnológica",
    category: "Desarrollo Web",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-web-1'),
    client: "Innovatech Solutions",
    description: "Un sitio web moderno, rápido y escalable para una startup de SaaS, diseñado para generar leads y comunicar una propuesta de valor compleja de forma sencilla.",
    challenge: "Crear una presencia online desde cero que pudiera competir en un mercado saturado, destacando la innovación del producto y generando confianza en potenciales inversores y clientes.",
    solution: "Diseñamos una experiencia de usuario (UX) centrada en la conversión, con un diseño limpio y profesional. Desarrollamos el sitio con Next.js para un rendimiento óptimo y un SEO técnico impecable. Integramos un CMS para que el equipo de marketing pudiera gestionar el contenido fácilmente.",
    services: ["Desarrollo Web", "Diseño UI/UX", "SEO Técnico"],
    website: "https://example.com",
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
    id: "boutique-ecommerce",
    title: "E-commerce para Boutique",
    category: "Desarrollo Web",
    image: PlaceHolderImages.find(img => img.id === 'portfolio-web-2'),
    client: "Artesanía Local",
    description: "Creación de una tienda online para una boutique de artesanías.",
    challenge: "Digitalizar un negocio tradicional, creando una plataforma de e-commerce que fuera fácil de gestionar para el propietario y que transmitiera la calidad y unicidad de los productos artesanales.",
    solution: "Desarrollamos una tienda online en Shopify, personalizando un tema para reflejar la identidad de la marca. Realizamos una sesión de fotografía de producto para asegurar imágenes de alta calidad y configuramos los métodos de pago y envío. El resultado fue un nuevo canal de ventas que expandió el alcance del negocio a nivel nacional.",
    services: ["Desarrollo Web", "E-commerce", "Fotografía de Producto"],
    website: "https://example.com",
    parallaxImages: {
      laptop: "/images/desarrollo web/laptop-2.png",
      phone: "/images/desarrollo web/phone-2.png"
    }
  }
];
