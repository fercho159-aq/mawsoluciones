
import { Course } from './course-data';

export const courseData: Course = {
  title: "Curso de Automatización de Flujos de Trabajo con n8n",
  description: "Aprende a automatizar tareas y a conectar tus aplicaciones favoritas sin necesidad de escribir código.",
  total_sections: 4,
  total_topics: 16,
  total_duration: "5 horas",
  sections: [
    {
      section_id: 1,
      title: "Introducción a n8n y la Automatización",
      order: 1,
      duration: "1h",
      completed: false,
      topics: [
        {
          topic_id: "n8n_1_1",
          section_id: 1,
          title: "¿Qué es n8n y para qué sirve?",
          video_url: "",
          duration: "15 min",
          summary: [
            "**Concepto de 'No-Code':** Entenderás el poder de la automatización sin necesidad de ser un programador.",
            "**Casos de uso reales:** Descubrirás cómo n8n puede automatizar desde la gestión de redes sociales hasta la sincronización de bases de datos.",
            "**n8n vs. Zapier/Make:** Conocerás las ventajas de n8n, como su flexibilidad y la posibilidad de auto-hospedaje (self-hosting).",
          ],
          questions: [],
          completed: false,
          order: 1,
        },
        {
          topic_id: "n8n_1_2",
          section_id: 1,
          title: "Instalación y Configuración del Entorno",
          video_url: "",
          duration: "20 min",
          summary: [
            "**n8n Cloud vs. Self-Hosting:** Evaluarás qué opción es la mejor para ti.",
            "**Instalación con Docker:** Seguirás un paso a paso para levantar tu propia instancia de n8n de forma rápida y sencilla.",
            "**Exploración de la Interfaz:** Te familiarizarás con el editor de flujos de trabajo, el panel de ejecuciones y las credenciales.",
          ],
          questions: [],
          completed: false,
          order: 2,
        },
        {
          topic_id: "n8n_1_3",
          section_id: 1,
          title: "Tu Primer Flujo de Trabajo (Workflow)",
          video_url: "",
          duration: "15 min",
          summary: [
            "**Anatomía de un Nodo:** Entenderás qué son los nodos (nodes) y cómo se conectan.",
            "**Nodos 'Trigger':** Aprenderás a iniciar un flujo de trabajo a partir de un evento (ej. cada hora, al recibir un webhook).",
            "**Creación de un 'Hola Mundo':** Construirás tu primer workflow que envía una notificación a Discord o Slack.",
          ],
          questions: [],
          completed: false,
          order: 3,
        },
        {
            topic_id: "n8n_1_4",
            section_id: 1,
            title: "Examen: Los Fundamentos de n8n",
            video_url: "",
            duration: "10 min",
            summary: [],
            questions: [
                {
                    "question": "¿Cuál es una de las principales ventajas de n8n frente a otras plataformas como Zapier?",
                    "options": [
                        "Tiene menos integraciones.",
                        "Es de código abierto y permite el auto-hospedaje (self-hosting).",
                        "Es mucho más caro.",
                        "Solo se puede usar en la nube."
                    ],
                    "correct": 1
                },
                {
                    "question": "¿Qué es un 'Nodo Trigger' en n8n?",
                    "options": [
                        "Un nodo que finaliza el flujo de trabajo.",
                        "Un nodo que realiza una acción, como enviar un email.",
                        "El nodo que inicia un flujo de trabajo basado en un evento.",
                        "Un nodo que solo sirve para hacer cálculos."
                    ],
                    "correct": 2
                },
                {
                    "question": "En la interfaz de n8n, el 'Canvas' o Editor es donde:",
                    "options": [
                        "Ves el historial de ejecuciones.",
                        "Guardas tus contraseñas.",
                        "Construyes y conectas los nodos de tu flujo de trabajo.",
                        "Instalas las actualizaciones."
                    ],
                    "correct": 2
                },
                {
                    "question": "Un 'workflow' en n8n es:",
                    "options": [
                        "Un solo nodo de acción.",
                        "Una secuencia de nodos conectados que automatizan un proceso.",
                        "Un tipo de base de datos.",
                        "El nombre de usuario para acceder a n8n."
                    ],
                    "correct": 1
                },
                {
                    "question": "El término 'No-Code' se refiere a:",
                    "options": [
                        "Programación muy compleja.",
                        "La capacidad de crear aplicaciones o automatizaciones sin escribir código.",
                        "Un error en el sistema.",
                        "Un lenguaje de programación antiguo."
                    ],
                    "correct": 1
                }
            ],
            completed: false,
            order: 4
        }
      ],
    },
    {
        section_id: 2,
        title: "Manejo de Datos y Nodos Esenciales",
        order: 2,
        duration: "1h 15min",
        completed: false,
        topics: [
            {
                topic_id: "n8n_2_1",
                section_id: 2,
                title: "La Estructura de Datos JSON en n8n",
                video_url: "",
                duration: "20 min",
                summary: [
                    "**Entendiendo JSON:** Aprenderás a leer la estructura de datos que n8n utiliza para pasar información entre nodos.",
                    "**El Visor de Datos:** Utilizarás la vista de 'Tabla' y 'JSON' para inspeccionar la información de cada paso.",
                    "**Acceso a Datos con Expresiones:** Escribirás tus primeras expresiones para acceder a datos específicos (ej. {{$json.body.name}}).",
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "n8n_2_2",
                section_id: 2,
                title: "Nodos de Lógica: IF y Switch",
                video_url: "",
                duration: "20 min",
                summary: [
                    "**Toma de Decisiones:** Aprenderás a usar el nodo 'IF' para crear ramas condicionales en tu flujo (ej. si el email contiene 'compra').",
                    "**Múltiples Caminos:** Utilizarás el nodo 'Switch' para dirigir el flujo por diferentes rutas según el valor de un dato.",
                    "**Combinación de Lógica:** Construirás workflows más inteligentes que reaccionan de manera diferente según la información que reciben.",
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "n8n_2_3",
                section_id: 2,
                title: "Manipulación de Datos: El Nodo 'Set'",
                video_url: "",
                duration: "20 min",
                summary: [
                    "**Creación de Nuevos Campos:** Aprenderás a añadir nuevos datos al flujo de trabajo.",
                    "**Modificación de Datos Existentes:** Utilizarás el nodo 'Set' para limpiar, formatear o cambiar valores.",
                    "**Mantener solo los Datos Necesarios:** Descubrirás cómo simplificar tu flujo seleccionando únicamente los datos que necesitas para los siguientes pasos.",
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "n8n_2_4",
                section_id: 2,
                title: "Examen: Controlando el Flujo de Datos",
                video_url: "",
                duration: "15 min",
                summary: [],
                questions: [
                    {
                        "question": "En n8n, para acceder al nombre de un cliente dentro de un objeto JSON, usarías una expresión como:",
                        "options": [
                            "{{$name}}",
                            "{{$json.name}}",
                            "{{$json.body.customer.name}} (dependiendo de la estructura)",
                            "get(name)"
                        ],
                        "correct": 2
                    },
                    {
                        "question": "¿Qué nodo utilizarías si necesitas que tu workflow tome un camino si un email contiene la palabra 'urgente' y otro camino si no la contiene?",
                        "options": [
                            "Set",
                            "IF",
                            "Merge",
                            "Execute Workflow"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "El nodo 'Set' te permite:",
                        "options": [
                            "Iniciar el flujo de trabajo.",
                            "Enviar un correo electrónico.",
                            "Añadir, modificar o eliminar campos de datos en el flujo.",
                            "Dividir el flujo en múltiples ramas."
                        ],
                        "correct": 2
                    },
                    {
                        "question": "La información entre los nodos de n8n viaja principalmente en un formato llamado:",
                        "options": [
                            "PDF",
                            "DOCX",
                            "JSON",
                            "MP3"
                        ],
                        "correct": 2
                    },
                    {
                        "question": "¿Cuándo usarías un nodo 'Switch' en lugar de un 'IF'?",
                        "options": [
                            "Nunca, son lo mismo.",
                            "Cuando solo tienes una condición.",
                            "Cuando tienes múltiples posibles valores para un dato y quieres una rama para cada uno.",
                            "Cuando quieres detener el flujo."
                        ],
                        "correct": 2
                    }
                ],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 3,
        title: "Integraciones Populares",
        order: 3,
        duration: "1h 30min",
        completed: false,
        topics: [
            {
                topic_id: "n8n_3_1",
                section_id: 3,
                title: "Automatizando Google Sheets",
                video_url: "",
                duration: "25 min",
                summary: [
                    "**Lectura de Filas:** Crearás un workflow que se ejecuta y lee datos desde una hoja de cálculo.",
                    "**Añadir y Actualizar Filas:** Aprenderás a añadir nuevos registros a un Google Sheet (ej. nuevos leads).",
                    "**Caso Práctico:** Construirás un formulario que guarde sus respuestas automáticamente en una hoja de cálculo.",
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "n8n_3_2",
                section_id: 3,
                title: "Conectando con APIs vía HTTP Request",
                video_url: "",
                duration: "25 min",
                summary: [
                    "**Conceptos de API y Webhooks:** Entenderás los fundamentos para conectar n8n con cualquier servicio online.",
                    "**Uso del Nodo 'HTTP Request':** Aprenderás a hacer peticiones GET y POST para obtener y enviar datos.",
                    "**Autenticación de API:** Configurarás credenciales para conectarte a APIs que requieren una clave (API Key).",
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "n8n_3_3",
                section_id: 3,
                title: "Automatización de Email y Comunicaciones",
                video_url: "",
                duration: "25 min",
                summary: [
                    "**Envío de Emails:** Configurarás el nodo de Gmail o SMTP para enviar correos automáticos.",
                    "**Notificaciones a Slack/Discord:** Crearás alertas automáticas para tu equipo.",
                    "**Caso Práctico:** Diseñarás un flujo que te notifique por Slack cada vez que entra una nueva venta en tu e-commerce.",
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "n8n_3_4",
                section_id: 3,
                title: "Examen: Conectando el Mundo",
                video_url: "",
                duration: "15 min",
                summary: [],
                questions: [
                    {
                        "question": "Para conectar n8n a un servicio que no tiene un nodo dedicado, ¿qué nodo usarías?",
                        "options": [
                            "Google Sheets",
                            "IF",
                            "HTTP Request",
                            "Start"
                        ],
                        "correct": 2
                    },
                    {
                        "question": "Un 'Webhook' es fundamentalmente:",
                        "options": [
                            "Un tipo de base de datos.",
                            "Una URL que espera recibir datos de otro servicio para iniciar un flujo.",
                            "Un nodo para hacer cálculos matemáticos.",
                            "Un error del sistema."
                        ],
                        "correct": 1
                    },
                    {
                        "question": "¿Qué acción te permite el nodo de Google Sheets?",
                        "options": [
                            "Leer, añadir y actualizar filas.",
                            "Crear gráficos dentro de n8n.",
                            "Formatear las celdas con colores.",
                            "Solo leer datos."
                        ],
                        "correct": 0
                    },
                    {
                        "question": "Si quieres enviar datos a una API para crear un nuevo cliente, ¿qué método HTTP usarías comúnmente?",
                        "options": [
                            "GET",
                            "POST",
                            "DELETE",
                            "UPDATE"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "Para enviar un email con n8n, necesitas configurar:",
                        "options": [
                            "Una cuenta de Instagram.",
                            "Credenciales de un proveedor de correo (como Gmail o un servidor SMTP).",
                            "Una hoja de cálculo.",
                            "Un nodo de HTTP Request."
                        ],
                        "correct": 1
                    }
                ],
                completed: false,
                order: 4
            }
        ]
    },
    {
        section_id: 4,
        title: "Flujos de Trabajo Avanzados",
        order: 4,
        duration: "1h 15min",
        completed: false,
        topics: [
            {
                topic_id: "n8n_4_1",
                section_id: 4,
                title: "Manejo de Bucles y Lotes (Looping)",
                video_url: "",
                duration: "25 min",
                summary: [
                    "**Procesamiento de Múltiples Items:** Aprenderás a procesar una lista de elementos (ej. emails) uno por uno.",
                    "**El Nodo 'Split in Batches':** Descubrirás cómo dividir grandes volúmenes de datos para procesarlos eficientemente.",
                    "**Evitar Límites de API:** Entenderás cómo los bucles y lotes te ayudan a no exceder los límites de los servicios que conectas.",
                ],
                questions: [],
                completed: false,
                order: 1
            },
            {
                topic_id: "n8n_4_2",
                section_id: 4,
                title: "Manejo de Errores en Workflows",
                video_url: "",
                duration: "20 min",
                summary: [
                    "**Configuración de 'Error Triggers':** Crearás flujos de trabajo que se ejecutan automáticamente cuando otro falla.",
                    "**Estrategias de Reintentos:** Aprenderás a configurar reintentos automáticos para fallos temporales.",
                    "**Notificaciones de Error:** Construirás un sistema que te alerte por email o Slack cuando algo sale mal.",
                ],
                questions: [],
                completed: false,
                order: 2
            },
            {
                topic_id: "n8n_4_3",
                section_id: 4,
                title: "Sub-Workflows y Reutilización",
                video_url: "",
                duration: "20 min",
                summary: [
                    "**El Nodo 'Execute Workflow':** Aprenderás a llamar a un flujo de trabajo desde otro, como si fuera una función.",
                    "**Modularización de Procesos:** Diseñarás flujos de trabajo más limpios y reutilizables.",
                    "**Creación de 'Helpers':** Construirás sub-workflows para tareas comunes (ej. formatear un teléfono, validar un email).",
                ],
                questions: [],
                completed: false,
                order: 3
            },
            {
                topic_id: "n8n_4_4",
                section_id: 4,
                title: "Examen Final: El Arquitecto de la Automatización",
                video_url: "",
                duration: "10 min",
                summary: [],
                questions: [
                    {
                        "question": "Si necesitas procesar 1000 contactos y enviar un email a cada uno, ¿qué nodo es esencial para manejar esta lista?",
                        "options": [
                            "IF",
                            "Start",
                            "Un nodo que maneje bucles o iteraciones sobre los items.",
                            "Merge"
                        ],
                        "correct": 2
                    },
                    {
                        "question": "¿Para qué sirve un 'Error Trigger'?",
                        "options": [
                            "Para generar errores a propósito.",
                            "Para iniciar un flujo de trabajo específico cuando otro flujo falla.",
                            "Para corregir errores de ortografía.",
                            "Para conectarse a una API."
                        ],
                        "correct": 1
                    },
                    {
                        "question": "El nodo 'Execute Workflow' te permite:",
                        "options": [
                            "Borrar un flujo de trabajo.",
                            "Llamar y ejecutar otro flujo de trabajo como parte del flujo actual.",
                            "Duplicar el flujo de trabajo actual.",
                            "Renombrar un flujo de trabajo."
                        ],
                        "correct": 1
                    },
                    {
                        "question": "¿Por qué es útil dividir los datos en lotes ('batches')?",
                        "options": [
                            "Porque hace que el flujo sea más lento.",
                            "Para procesar grandes volúmenes de datos sin exceder los límites de las APIs y para un mejor manejo de errores.",
                            "Porque es obligatorio para todos los nodos.",
                            "Para que los datos se vean más organizados."
                        ],
                        "correct": 1
                    },
                    {
                        "question": "La principal ventaja de usar sub-workflows es:",
                        "options": [
                            "Aumentar la complejidad del sistema.",
                            "Crear flujos más largos y difíciles de leer.",
                            "Poder reutilizar lógica común en múltiples flujos, haciéndolos más modulares y fáciles de mantener.",
                            "Ocupar más espacio en el servidor."
                        ],
                        "correct": 2
                    }
                ],
                completed: false,
                order: 4
            }
        ]
    }
  ],
};

    