
export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Topic {
  topic_id: string;
  section_id: number;
  title: string;
  video_url: string;
  duration: string;
  summary: string[];
  questions: Question[];
  completed: boolean;
  order: number;
}

export interface Section {
  section_id: number;
  title: string;
  order: number;
  duration: string;
  completed: boolean;
  topics: Topic[];
}

export interface Course {
  title: string;
  description: string;
  total_sections: number;
  total_topics: number;
  total_duration: string;
  sections: Section[];
}

export const courseData: Course = {
  title: "Curso Completo de Facebook Ads para Principiantes",
  description: "Aprende desde cero a crear campañas efectivas",
  total_sections: 6,
  total_topics: 24,
  total_duration: "8 horas",
  sections: [
    {
      section_id: 1,
      title: "Conociendo Facebook Ads",
      order: 1,
      duration: "45 min",
      completed: false,
      topics: [
        {
          topic_id: "1_1",
          section_id: 1,
          title: "¿Qué es Facebook Ads?",
          video_url: "",
          duration: "10 min",
          summary: [
            "Fundamentos de la Publicidad Pagada: Entenderás la diferencia clave entre alcance orgánico y pagado y por qué necesitas ambos.",
            "Ecosistema de Meta: Conocerás cómo se conectan Facebook, Instagram, Messenger y WhatsApp para la publicidad.",
            "Análisis de Casos de Éxito: Verás ejemplos reales de cómo empresas mexicanas han triunfado usando la plataforma.",
          ],
          questions: [
            {
              question: "¿Cuál es el propósito principal de Facebook Ads?",
              options: ["Publicar fotos personales", "Hacer publicidad pagada", "Chatear con amigos", "Ver videos gratis"],
              correct: 1,
            },
            {
              question: "¿Qué distingue a la publicidad pagada de la orgánica?",
              options: ["Es gratis", "Garantiza ventas inmediatas", "Permite una segmentación precisa del público", "Solo aparece en el feed de noticias"],
              correct: 2,
            },
            {
              question: "Un caso de éxito en Facebook Ads demuestra que la plataforma es útil para:",
              options: ["Solo grandes corporaciones", "Todo tipo de negocios, incluyendo PYMES", "Solo para vender productos físicos", "Exclusivamente para generar 'likes'"],
              correct: 1,
            },
          ],
          completed: false,
          order: 1,
        },
        {
          topic_id: "1_2",
          section_id: 1,
          title: "Anatomía del Administrador de Anuncios",
          video_url: "",
          duration: "15 min",
          summary: [
            "Navegación Fluida: Te moverás con confianza por el Business Manager, encontrando cada herramienta que necesitas.",
            "Estructura Jerárquica: Dominarás la lógica de Campaña > Conjunto de Anuncios > Anuncio, la base de toda campaña exitosa.",
            "Configuración Financiera: Aprenderás a configurar tu cuenta publicitaria y método de pago de forma segura.",
          ],
          questions: [],
          completed: false,
          order: 2,
        },
        {
            topic_id: "1_3",
            section_id: 1,
            title: "Objetivos de Campaña: ¿Qué quieres lograr?",
            video_url: "",
            duration: "12 min",
            summary: [
                "Claridad Estratégica: Sabrás diferenciar entre objetivos de Reconocimiento, Consideración y Conversión.",
                "Selección Inteligente: Elegirás el objetivo de campaña que se alinea perfectamente con tu meta de negocio.",
                "Aplicación Práctica: Podrás diseñar la estrategia inicial para un e-commerce, un restaurante o un servicio profesional."
            ],
            questions: [],
            completed: false,
            order: 3,
        },
        {
            topic_id: "1_4",
            section_id: 1,
            title: "El Píxel de Meta y su importancia",
            video_url: "",
            duration: "8 min",
            summary: [
                "Medición Precisa: Comprenderás por qué el Píxel es tu mejor aliado para medir el retorno de inversión.",
                "Instalación Técnica: Aprenderás a instalar el Píxel en las plataformas más comunes como WordPress y Shopify.",
                "Seguimiento de Eventos: Serás capaz de verificar que tu Píxel funciona y mide las acciones importantes en tu web."
            ],
            questions: [],
            completed: false,
            order: 4,
        },
      ],
    },
    {
        section_id: 2,
        title: "Segmentación y Públicos",
        order: 2,
        duration: "1h 15 min",
        completed: false,
        topics: [
            {
                topic_id: "2_1",
                section_id: 2,
                title: "Creando tu Buyer Persona",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Definición de Cliente Ideal: Sabrás exactamente a quién le estás hablando, más allá de datos demográficos.",
                    "Investigación de Audiencia: Utilizarás herramientas para descubrir los verdaderos intereses y dolores de tu público.",
                    "Perfil Completo: Construirás un Buyer Persona detallado, incluyendo sus motivaciones y comportamientos."
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "2_2",
                section_id: 2,
                title: "Públicos Guardados: Intereses y Comportamientos",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Dominio de la Segmentación Detallada: Navegarás con soltura por las opciones de intereses y comportamientos de Meta.",
                    "Descubrimiento de Nichos: Aprenderás técnicas para encontrar audiencias específicas que tu competencia ignora.",
                    "Precisión Quirúrgica: Utilizarás la combinación y exclusión de públicos para afinar tu segmentación al máximo."
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "2_3",
                section_id: 2,
                title: "Públicos Personalizados: Tu Activo Más Valioso",
                video_url: "",
                duration: "25 min",
                summary: [
                    "Aprovechamiento de Datos Propios: Crearás públicos a partir de tu lista de clientes para re-impactarlos.",
                    "Estrategias de Retargeting: Implementarás campañas para usuarios que ya visitaron tu sitio web, aumentando la conversión.",
                    "Engagement Profundo: Construirás públicos basados en la interacción con tus perfiles de Facebook e Instagram."
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "2_4",
                section_id: 2,
                title: "Públicos Similares (Lookalikes): Escalando tu Alcance",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Comprensión del Algoritmo: Entenderás cómo Meta encuentra personas parecidas a tus mejores clientes.",
                    "Creación de Lookalikes Efectivos: Generarás públicos similares de alta calidad a partir de tus audiencias personalizadas.",
                    "Estrategias de Expansión: Sabrás cómo y cuándo expandir tus públicos similares del 1% al 10% para escalar tus campañas."
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 3,
        title: "Creación de Anuncios que Impactan",
        order: 3,
        duration: "1h 30 min",
        completed: false,
        topics: [
            {
                topic_id: "3_1",
                section_id: 3,
                title: "Formatos de Anuncio: Imagen vs. Video vs. Carrusel",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Decisión Estratégica de Formato: Sabrás qué formato usar según tu objetivo y tipo de producto.",
                    "Optimización Técnica: Conocerás las especificaciones y tamaños recomendados para cada ubicación.",
                    "Maximización de Impacto: Aprenderás cuándo un video es más efectivo que una imagen o cómo un carrusel puede contar una historia."
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "3_2",
                section_id: 3,
                title: "Copywriting para Anuncios: El Arte de Persuadir",
                video_url: "",
                duration: "25 min",
                summary: [
                    "Estructura Persuasiva: Dominarás la fórmula Gancho-Problema-Solución-CTA para escribir textos que venden.",
                    "Técnicas de Storytelling: Aprenderás a conectar emocionalmente con tu audiencia a través de historias.",
                    "Adaptación de Mensaje: Sabrás cómo ajustar tu copy para diferentes públicos y etapas del embudo de ventas."
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "3_3",
                section_id: 3,
                title: "Diseño Visual para Anuncios con Canva",
                video_url: "",
                duration: "25 min",
                summary: [
                    "Principios de Diseño Publicitario: Entenderás los fundamentos de color, tipografía y composición para anuncios.",
                    "Creación Práctica en Canva: Diseñarás un anuncio de imagen atractivo y profesional desde cero.",
                    "Producción de Video Corto: Aprenderás a crear videos dinámicos para Reels y Stories que capturan la atención."
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "3_4",
                section_id: 3,
                title: "Llamadas a la Acción (CTAs) Efectivas",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Psicología del CTA: Comprenderás qué motiva a un usuario a hacer clic.",
                    "Redacción de CTAs Poderosos: Escribirás llamadas a la acción que van más allá del 'Comprar ahora'.",
                    "Optimización con Pruebas A/B: Implementarás pruebas para encontrar el CTA que genera más conversiones."
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 4,
        title: "Presupuesto y Estrategias de Puja",
        order: 4,
        duration: "1h",
        completed: false,
        topics: [
            {
                topic_id: "4_1",
                section_id: 4,
                title: "Presupuesto Diario vs. Presupuesto Total",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Gestión de Inversión: Sabrás cuándo es mejor usar un presupuesto diario o uno total para tu campaña.",
                    "Cálculo de Presupuesto Inicial: Aprenderás un método para definir cuánto invertir al empezar.",
                    "Escalado Controlado: Conocerás estrategias para aumentar tu presupuesto de forma segura y rentable."
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "4_2",
                section_id: 4,
                title: "Estrategias de Puja Automáticas vs. Manuales",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Dominio de Estrategias de Puja: Entenderás las pujas por menor costo, costo objetivo y retorno de la inversión (ROAS).",
                    "Uso de IA para Pujas: Aprenderás a sacar provecho de las pujas automáticas de Advantage+.",
                    "Control Manual: Sabrás en qué situaciones específicas puede ser útil tomar el control manual de las pujas."
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "4_3",
                section_id: 4,
                title: "Optimización del Presupuesto de la Campaña (CBO)",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Funcionamiento de CBO: Comprenderás cómo el algoritmo de Meta distribuye tu presupuesto automáticamente.",
                    "Mejores Prácticas con CBO: Aplicarás las estrategias correctas para maximizar los resultados con CBO.",
                    "Prevención de Errores: Evitarás los errores más comunes que limitan la eficacia de la optimización de presupuesto."
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "4_4",
                section_id: 4,
                title: "Planificación y Calendario de Anuncios",
                video_url: "",
                duration: "10 min",
                summary: [
                    "Programación Efectiva: Aprenderás a programar tus anuncios para que se muestren en los momentos de mayor impacto.",
                    "Estrategias Estacionales: Planificarás campañas para fechas clave como El Buen Fin, Navidad o Hot Sale.",
                    "Análisis de Horarios: Utilizarás los datos para identificar los mejores días y horas para tu negocio."
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 5,
        title: "Métricas y Optimización",
        order: 5,
        duration: "1h 30 min",
        completed: false,
        topics: [
            {
                topic_id: "5_1",
                section_id: 5,
                title: "Métricas Clave: ¿Qué Debes Medir?",
                video_url: "",
                duration: "25 min",
                summary: [
                    "Interpretación de Métricas: Entenderás a fondo indicadores como CTR, CPC, CPA, ROAS y Frecuencia.",
                    "Dashboard Personalizado: Configurarás tus columnas en el Administrador de Anuncios para ver solo lo que importa.",
                    "Enfoque en Resultados: Distinguirás entre las 'métricas de vanidad' y las que realmente impactan en tu negocio."
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "5_2",
                section_id: 5,
                title: "Interpretando los Resultados de tus Campañas",
                video_url: "",
                duration: "25 min",
                summary: [
                    "Análisis de Informes: Aprenderás a leer e interpretar los reportes de rendimiento de tus campañas.",
                    "Diagnóstico de Embudos: Identificarás los puntos débiles en tu embudo de conversión donde pierdes clientes.",
                    "Obtención de Insights: Utilizarás los desgloses por edad, ubicación o dispositivo para entender mejor a tu audiencia."
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "5_3",
                section_id: 5,
                title: "Pruebas A/B para Optimización Continua",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Metodología de Pruebas: Sabrás qué elementos de tus anuncios (creatividades, públicos, copys) puedes y debes probar.",
                    "Configuración de Experimentos: Implementarás pruebas A/B de manera correcta para obtener datos fiables.",
                    "Toma de Decisiones Basada en Datos: Analizarás los resultados de tus pruebas para optimizar tus campañas de forma continua."
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "5_4",
                section_id: 5,
                title: "Escalado de Campañas Exitosas",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Estrategias de Crecimiento: Conocerás las técnicas de escalado vertical (más presupuesto) y horizontal (nuevos públicos).",
                    "Escalado Inteligente: Aprenderás a aumentar la inversión sin sacrificar el rendimiento de tus campañas.",
                    "Prevención de Errores de Escalado: Evitarás los fallos más comunes al intentar hacer crecer tus campañas."
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 6,
        title: "Estrategias Avanzadas y Futuro",
        order: 6,
        duration: "1h",
        completed: false,
        topics: [
            {
                topic_id: "6_1",
                section_id: 6,
                title: "Estrategias de Retargeting Avanzado",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Embudos de Retargeting: Crearás secuencias de anuncios basadas en el tiempo y la interacción del usuario.",
                    "Retargeting Dinámico: Implementarás anuncios de producto dinámicos para recuperar carritos abandonados en e-commerce.",
                    "Recuperación de Clientes: Aplicarás estrategias específicas para volver a conectar con clientes antiguos."
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "6_2",
                section_id: 6,
                title: "Campañas de Generación de Leads (Lead Ads)",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Formularios Instantáneos: Configurarás campañas de Lead Ads que capturan datos sin que el usuario salga de Facebook.",
                    "Integración con CRM: Conectarás tus formularios con tu CRM o sistema de email para un seguimiento inmediato.",
                    "Cualificación de Leads: Aprenderás a usar los campos del formulario para cualificar a tus prospectos."
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "6_3",
                section_id: 6,
                title: "Anuncios para Mensajes (WhatsApp y Messenger)",
                video_url: "",
                duration: "15 min",
                summary: [
                    "Marketing Conversacional: Utilizarás anuncios para iniciar conversaciones de venta directamente en WhatsApp y Messenger.",
                    "Automatización de Respuestas: Configurarás respuestas automáticas para gestionar las consultas iniciales.",
                    "Casos de Uso Prácticos: Implementarás campañas de mensajes para agendar citas, dar cotizaciones y ofrecer soporte."
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "6_4",
                section_id: 6,
                title: "El Futuro de Facebook Ads: IA y Privacidad",
                video_url: "",
                duration: "10 min",
                summary: [
                    "Adaptación a la Privacidad: Entenderás el impacto de las políticas de privacidad como iOS 14+ y cómo adaptarte.",
                    "Dominio de la IA: Sacarás el máximo provecho a las herramientas de Advantage+ y la IA de Meta.",
                    "Visión a Futuro: Conocerás las tendencias emergentes para mantener tus estrategias a la vanguardia."
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    }
  ],
};
