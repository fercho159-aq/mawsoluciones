
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
            "Introducción a la publicidad pagada en Facebook.",
            "Diferencias clave entre publicidad orgánica y pagada.",
            "Análisis de casos de éxito reales de empresas mexicanas.",
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
            "Recorrido por la interfaz del Business Manager.",
            "Diferencia entre Campaña, Conjunto de Anuncios y Anuncio.",
            "Configuración inicial de tu cuenta publicitaria y método de pago.",
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
              "Explicación de los objetivos de Reconocimiento, Consideración y Conversión.",
              "Cómo elegir el objetivo correcto según tu meta de negocio.",
              "Ejemplos prácticos para un e-commerce, un restaurante y un servicio profesional.",
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
              "Qué es el Píxel y por qué es fundamental para medir resultados.",
              "Cómo instalar el Píxel en tu sitio web (WordPress, Shopify, etc.).",
              "Verificación del Píxel y eventos estándar.",
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
                    "La importancia de definir a tu cliente ideal.",
                    "Herramientas para investigar a tu audiencia.",
                    "Creación de un perfil demográfico y psicográfico.",
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "2_2",
                section_id: 2,
                title: "Públicos Guardados: Segmentación por Intereses y Comportamientos",
                video_url: "",
                duration: "20 min",
                summary: [
                    "Cómo usar la segmentación detallada de Meta.",
                    "Estrategias para encontrar intereses ocultos y de nicho.",
                    "Combinación y exclusión de públicos para mayor precisión.",
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
                    "Creación de públicos a partir de tu lista de clientes.",
                    "Públicos basados en visitantes de tu sitio web (Retargeting).",
                    "Públicos de interacción con tu página de Facebook o perfil de Instagram.",
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
                    "Qué son los públicos similares y cómo funcionan.",
                    "Creación de Lookalikes efectivos a partir de tus mejores públicos personalizados.",
                    "Estrategias de expansión de 1% a 10%.",
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
                    "Ventajas y desventajas de cada formato.",
                    "Cuándo usar cada tipo de anuncio para máximo impacto.",
                    "Recomendaciones de tamaño y especificaciones técnicas.",
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
                    "Estructura de un copy efectivo (Gancho, Problema, Solución, CTA).",
                    "Técnicas de escritura persuasiva y storytelling.",
                    "Cómo adaptar tu mensaje a diferentes audiencias.",
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
                    "Principios básicos de diseño para no diseñadores.",
                    "Creación de una imagen de anuncio atractiva desde cero en Canva.",
                    "Tips para crear videos cortos y dinámicos para Reels y Stories.",
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
                    "Psicología detrás de un buen CTA.",
                    "Ejemplos de CTAs que generan clics.",
                    "Pruebas A/B para optimizar tus llamadas a la acción.",
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
                    "Diferencias y cuándo usar cada opción.",
                    "Cómo calcular tu presupuesto inicial.",
                    "Estrategias para escalar el presupuesto de forma segura.",
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
                    "Entendiendo las pujas por menor costo, costo objetivo y ROAS.",
                    "Ventajas de las pujas automáticas con Advantage+.",
                    "Cuándo considerar el control de puja manual.",
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
                    "Cómo funciona CBO (Campaign Budget Optimization).",
                    "Mejores prácticas para usar CBO de manera efectiva.",
                    "Errores comunes a evitar con la optimización de presupuesto.",
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
                    "Cómo programar tus anuncios para los momentos más efectivos.",
                    "Estrategias para campañas estacionales (El Buen Fin, Navidad, etc.).",
                    "Análisis de los mejores días y horas para tu negocio.",
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
                    "Entendiendo métricas como CTR, CPC, CPA, ROAS y Frecuencia.",
                    "Cómo personalizar tus columnas en el Administrador de Anuncios.",
                    "Diferencia entre métricas de vanidad y métricas de negocio.",
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
                    "Cómo leer y analizar tus informes de rendimiento.",
                    "Identificación de cuellos de botella en tu embudo de conversión.",
                    "Uso de desgloses para obtener insights más profundos (edad, ubicación, dispositivo).",
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
                    "Qué elementos puedes probar (creatividades, públicos, copys).",
                    "Cómo configurar una prueba A/B de manera correcta.",
                    "Análisis de los resultados para tomar decisiones basadas en datos.",
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
                    "Estrategias de escalado vertical y horizontal.",
                    "Cómo aumentar el presupuesto sin perder rendimiento.",
                    "Errores comunes al intentar escalar y cómo evitarlos.",
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
                    "Creación de embudos de retargeting basados en el tiempo.",
                    "Retargeting dinámico de productos para e-commerce.",
                    "Estrategias para recuperar carritos abandonados.",
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
                    "Cómo configurar formularios instantáneos dentro de Facebook.",
                    "Integración de Lead Ads con tu CRM o sistema de email marketing.",
                    "Mejores prácticas para cualificar los leads generados.",
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
                    "Cómo iniciar conversaciones de venta a través de anuncios.",
                    "Estrategias para automatizar respuestas iniciales.",
                    "Casos de uso para agendamiento, cotizaciones y soporte.",
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
                    "Impacto de las políticas de privacidad (iOS 14+).",
                    "El rol creciente de la IA (Advantage+).",
                    "Tendencias a seguir para mantenerte a la vanguardia.",
                ],
                questions: [],
                completed: false,
                order: 4
            }
        ]
    }
  ],
};
