
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
    id: "core-31-fitness",
    title: "Creación de Sitio Web de Alto Impacto para CORE 31 Wod & Fitness",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-core31",
      description: "CORE 31 Wod & Fitness website",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltfGVufDB8fHx8MTc2MjI1NTAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "fitness gym"
    },
    client: "CORE 31 Wod & Fitness",
    description: "Desarrollo del sitio web principal para el box de Wod & Fitness, CORE 31. La plataforma fue diseñada para ser el principal canal de captación de nuevos miembros, transmitiendo la energía de su comunidad y detallando de forma clara su completa oferta de clases, horarios y coaches.",
    challenge: "El principal desafío fue capturar la alta energía, la intensidad y el fuerte sentido de comunidad de un box de CrossFit en un formato digital. El sitio no podía ser una página corporativa estática; debía ser visualmente impactante y motivador desde el primer segundo. El reto técnico consistía en organizar de manera intuitiva una gran cantidad de información clave (múltiples tipos de clases, perfiles de coaches, un horario detallado, planes de precios) en un formato de una sola página (one-page), asegurando que la navegación fuera fluida y que el sitio cargara rápidamente, a pesar de la gran cantidad de imágenes de alta calidad necesarias para transmitir la atmósfera del lugar.",
    solution: "Para lograr la velocidad y la experiencia de usuario deseadas, desarrollamos un sitio web estático (HTML, CSS y JavaScript), lo que garantiza un rendimiento óptimo y una seguridad robusta. Nuestra solución se centró en: Diseño Inmersivo y Enérgico, Navegación One-Page Fluida, Arquitectura de Información Clara y Enfoque Mobile-First.",
    services: ["Diseño y Desarrollo Web (HTML/CSS/JS)", "Diseño de Experiencia de Usuario (UX/UI)", "Desarrollo Responsive (Mobile-First)", "Arquitectura de la Información", "Optimización de Rendimiento Web (WPO)"],
    website: "https://core31.com.mx/index.html",
  },
  {
    id: "boda-santiago-loreto",
    title: "Creación de Sitio Web Interactivo para Boda: Santiago y Loreto",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-boda",
      description: "Wedding website for Santiago and Loreto",
      imageUrl: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZGV0YWlsc3xlbnwwfHx8fDE3NjIyNTQ0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "wedding details"
    },
    client: "Santiago y Loreto",
    description: "Desarrollo de la plataforma digital oficial para la boda de Santiago y Loreto. Este proyecto va más allá de una simple invitación; es un hub central e interactivo diseñado para guiar a los invitados a través de toda la experiencia del evento, gestionando desde la información logística hasta la confirmación de asistencia (RSVP) y la mesa de regalos.",
    challenge: "El desafío principal era crear una experiencia digital que capturara la esencia y la estética de la pareja, combinando elegancia con funcionalidad moderna. El sitio debía ser el único punto de verdad para cientos de invitados, por lo que requería una fiabilidad absoluta. Los retos clave fueron: Gestión de Asistencia (RSVP), Experiencia Mobile-First, Bilingüismo e Interactividad.",
    solution: "Para garantizar un rendimiento de primer nivel y una experiencia de usuario moderna (tipo Single Page Application o SPA), desarrollé el sitio utilizando un stack de JavaScript moderno, específicamente React (Next.js), y lo desplegué en la plataforma global de Vercel. La solución se enfocó en: Desarrollo Front-End Moderno, Gestión de RSVP, Internacionalización (i18n), Diseño Adaptable (Responsive) y Optimización de Despliegue.",
    services: ["Diseño y Desarrollo Web Front-End (React/Next.js)", "Diseño de Experiencia de Usuario (UX/UI)", "Desarrollo Responsive (Mobile-First)", "Implementación de Internacionalización (i18n)", "Integración de API (Google Maps, Spotify, RSVP Backend)", "Despliegue y Configuración (Vercel)"],
    website: "https://santiagoyloreto.vercel.app/es",
  },
  {
    id: "dc-solutions-b2b",
    title: "Creación de Plataforma Digital B2B para DC Solutions: Expertos en Gestión de Impresión y Digitalización",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-dcsolutions",
      description: "DC Solutions website showcasing office technology",
      imageUrl: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB0ZWNoJTIwc29sdXRpb25zfGVufDB8fHx8MTc2MjI1MzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "office technology"
    },
    client: "DC Solutions",
    description: "Desarrollo del sitio web corporativo para DC Solutions, un destacado Gold Partner de HP y socio de Xerox. El proyecto se centró en diseñar una plataforma B2B profesional que comunicara eficazmente su portafolio de servicios administrados de impresión, digitalización y soporte técnico, optimizada para la generación de prospectos calificados.",
    challenge: "El reto principal era traducir un conjunto de servicios B2B altamente técnicos y especializados (como los Servicios Administrados de Impresión y la digitalización de flujos de trabajo) en una experiencia de usuario (UX) clara, intuitiva y convincente. El sitio web debía proyectar un alto nivel de confianza y profesionalismo para atraer a su público objetivo (gerentes de TI, directores de finanzas y operaciones). Era crucial diferenciar claramente sus líneas de negocio —renta, venta, soporte y soluciones de software— y estructurar la información de manera que cada visitante empresarial pudiera identificar rápidamente la solución a su necesidad específica, guiándolo hacia el contacto.",
    solution: "Implementamos un sitio web corporativo con un diseño limpio, moderno y enfocado en la usabilidad. La arquitectura de la información se planificó meticulosamente para segmentar los servicios y facilitar la navegación. Nuestra solución incluyó: Diseño UI/UX Corporativo, Estructura Orientada a la Conversión, Desarrollo sobre un CMS (WordPress) y Diseño Adaptable (Responsive).",
    services: ["Diseño y Desarrollo Web Corporativo", "Diseño de Experiencia de Usuario (UX/UI)", "Arquitectura de la Información", "Implementación y Personalización de CMS (WordPress)", "Optimización de Rendimiento y Velocidad (WPO)", "Desarrollo Responsive (Adaptable)", "Consultoría SEO On-Page"],
    website: "https://www.dcsolutions.com.mx/",
  },
  {
    id: "my-team-platform",
    title: "My Team: Creando una Plataforma Digital para el Deporte como Catalizador de Cambio",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-myteam",
      description: "My Team website showing collaboration in sports",
      imageUrl: "https://images.unsplash.com/photo-1521464307205-2a2b034a7019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0ZWFtJTIwY2VsZWJyYXRpbmd8ZW58MHx8fHwxNzYyMjUyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "sports team celebrating"
    },
    client: "My Team",
    description: "Desarrollamos el sitio web oficial de My Team, una marca que ve el deporte \"Más allá del deporte\". Creamos un ecosistema digital que fusiona una revista de contenido inspirador con una plataforma de e-commerce bajo una filosofía de impacto social.",
    challenge: "My Team no es solo una revista deportiva, es un movimiento centrado en la colaboración, la sustentabilidad y la equidad de género. El desafío era diseñar una plataforma digital que pudiera articular esta filosofía compleja. Necesitábamos integrar con éxito tres componentes distintos —una revista digital (Revista My Team), un portafolio de proyectos de impacto (Proyectos) y una tienda en línea (Tienda)— en una experiencia de usuario cohesiva que inspirara un sentido de pertenencia y comunidad.",
    solution: "Construimos un sitio web dinámico y moderno que sirve como el corazón de la marca My Team. Creamos una estructura de contenido clara que permite a los usuarios sumergirse en las historias de la revista, entender la filosofía de la marca y comprar productos en la tienda de forma intuitiva. El diseño visual se centró en transmitir los valores clave de \"colaboración, pasión y pertenencia\", utilizando imágenes impactantes y una navegación fluida para asegurar que cada visita comunicara la misión de My Team: usar el deporte como una herramienta para el cambio positivo.",
    services: ["Diseño y Desarrollo Web", "Creación de Plataforma de Revista Digital (Blog)", "Integración de E-commerce (Tienda en línea)", "Diseño de Experiencia de Usuario (UX) e Interfaz de Usuario (UI)", "Desarrollo de Identidad de Marca Digital"],
    website: "https://myteam-mag.com/",
  },
  {
    id: "fic-los-cabos",
    title: "Festival Internacional de Cine de Los Cabos: Una Plataforma Digital #BeyondTheScreen",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-ficc",
      description: "Feria del cine de los cabos",
      imageUrl: "/images/desarrollo web/1.png",
      imageHint: "movie festival website"
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
    id: "dfac-accesorios-cimbra",
    title: "DFAC - Accesorios para Cimbra: Digitalizando la Confianza y Velocidad en la Construcción",
    category: "Desarrollo Web",
    image: {
        id: "portfolio-web-dfac",
        description: "DFAC website",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDB8fHx8MTc2MjI0NTcwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "construction site"
    },
    client: "DFAC - Accesorios para Cimbra",
    description: "Desarrollamos la plataforma web B2B para DFAC (Cimbra y Accesorios), creando un catálogo digital optimizado para la generación de cotizaciones urgentes y destacando su promesa de entrega de material en menos de 24 horas.",
    challenge: "El principal diferenciador de DFAC es su capacidad logística para entregar accesorios de cimbra y andamiaje en la obra en menos de 24 horas. El reto era crear un sitio web que no solo mostrara su extenso catálogo de productos técnicos (moños, puntales, etc.), sino que también transmitiera esta sensación de urgencia, confiabilidad y servicio experto a un público B2B (ingenieros, arquitectos y jefes de obra) que toma decisiones bajo presión.",
    solution: "Construimos un sitio web corporativo enfocado en la conversión y la velocidad. El diseño prioriza las llamadas a la acción (CTAs) para contacto inmediato, como un botón flotante de WhatsApp para \"Material de URGENCIA\" y formularios de cotización simplificados accesibles desde cada producto del catálogo. Organizamos los productos de forma intuitiva y destacamos sus clientes de alto perfil (BBVA, UNAM) y testimonios para construir credibilidad instantánea. El resultado es una herramienta digital que funciona como un socio logístico: rápido, eficiente y confiable.",
    services: ["Diseño Web Corporativo B2B", "Desarrollo de Catálogo de Productos (con solicitud de cotización)", "Diseño UX/UI enfocado a la Generación de Leads", "Integración de Chat (WhatsApp) y Formularios de Contacto", "Optimización para Dispositivos Móviles"],
    website: "https://cimbrayaccesorios.com.mx/",
    parallaxImages: {
      laptop: "https://images.unsplash.com/photo-1581094376363-9521a37c867a?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      phone: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&amp;w=2069&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
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
  },
   {
    id: "paolo-gourmet",
    title: "Paolo Gourmet: Diseño de una Experiencia E-commerce Premium para Tablas de Queso Artesanales",
    category: "Desarrollo Web",
    image: {
      id: "portfolio-web-paolo",
      description: "Paolo Gourmet website",
      imageUrl: "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcnRpc2FuYWwlMjBjaGVlc2UlMjBib2FyZHxlbnwwfHx8fDE3NjIyNDg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "artisanal cheese board"
    },
    client: "Paolo Gourmet",
    description: "Desarrollamos la tienda en línea para Paolo Gourmet, un e-commerce sofisticado enfocado en la venta de tablas de queso artesanales y cajas gourmet, diseñado para transmitir lujo, calidad y facilitar la compra para eventos y regalos en CDMX.",
    challenge: "El producto de Paolo Gourmet es altamente visual y premium. El reto era crear una plataforma digital que no solo funcionara como un catálogo de productos, sino que también capturara la elegancia, frescura y el \"arte de compartir\" que define a la marca. Necesitábamos construir un sitio que inspirara confianza, manejara pedidos con 24 horas de anticipación y facilitara las solicitudes de cotizaciones personalizadas para eventos grandes.",
    solution: "Diseñamos y construimos una plataforma de e-commerce limpia, moderna y centrada en la fotografía de alta calidad del producto. Creamos una estructura de navegación clara que separa los productos por categorías lógicas (Tablas Premium, Cajas, Letras y números), destacando el número de personas que atiende cada producto. Integramos CTAs (Llamadas a la Acción) claras para pedidos directos por WhatsApp y correo, y destacamos los testimonios de clientes para generar prueba social y confianza. El resultado es un sitio que funciona como una boutique digital de lujo.",
    services: ["Diseño y Desarrollo de E-commerce", "Diseño de Experiencia de Usuario (UX) e Interfaz de Usuario (UI)", "Desarrollo de Catálogo Digital de Productos", "Integración de Pedidos (WhatsApp y Correo)", "Optimización para Dispositivos Móviles (Responsive Design)"],
    website: "https://paologourmet.com.mx/",
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
  }
];

    

    
