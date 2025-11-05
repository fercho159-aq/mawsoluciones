

import { addDays, startOfMonth } from 'date-fns';

export type EventType = "grabacion" | "cita_venta";

export type ActivityEvent = {
  id: string;
  type: EventType;
  clientName: string;
  assignedTo: string;
  assignedToName: string;
  assignedToColor: string;
  fullStart: Date;
  fullEnd: Date;
  location: string;
  locationType: "estudio" | "exterior" | "oficina_cliente" | "videollamada" | "presencial";
  project?: string;
  assignedEquipment?: string[];
  equipmentNames?: string[];
};


export const initialEvents: ActivityEvent[] = [
    {
        id: `rec-1730812800000`,
        type: "grabacion",
        clientName: "Biofert",
        assignedTo: "luis-01",
        assignedToName: "Luis",
        assignedToColor: '#2563EB',
        fullStart: new Date('2024-11-05T10:00:00'),
        fullEnd: new Date('2024-11-05T12:00:00'),
        location: "Estudio Principal",
        locationType: "estudio",
        assignedEquipment: ["eq1", "eq2"],
        equipmentNames: ["Micrófono Hollyland", "Cámara Sony FX3"],
        project: "Videos testimoniales para Q4"
    },
     {
        id: `rec-1730985600000`,
        type: "grabacion",
        clientName: "Constructora Edifica",
        assignedTo: "luis-01",
        assignedToName: "Luis",
        assignedToColor: '#2563EB',
        fullStart: new Date('2024-11-07T14:00:00'),
        fullEnd: new Date('2024-11-07T16:30:00'),
        location: "Oficinas del Cliente",
        locationType: "oficina_cliente",
        assignedEquipment: ["eq5"],
        equipmentNames: ["iPhone 15 Pro"],
        project: "Entrevistas para video corporativo"
    },
    {
        id: `cita-1730812800000`,
        type: "cita_venta",
        clientName: "Tacos El Veloz",
        assignedTo: "julio-01",
        assignedToName: "Julio",
        assignedToColor: '#D97706',
        fullStart: new Date('2024-11-06T11:00:00'),
        fullEnd: new Date('2024-11-06T12:00:00'),
        location: "meet.google.com/xyz-abc",
        locationType: "videollamada",
        project: "Videollamada de seguimiento"
    },
     {
        id: `cita-1730985600000`,
        type: "cita_venta",
        clientName: "Clínica Dental Sonrisa",
        assignedTo: "alma-01",
        assignedToName: "Alma",
        assignedToColor: '#DB2777',
        fullStart: new Date('2024-11-08T16:00:00'),
        fullEnd: new Date('2024-11-08T17:00:00'),
        location: "Oficinas del cliente",
        locationType: "presencial",
        project: "Cita de cierre"
    }
];

export type StatusPendiente = "Pendiente del cliente" | "Trabajando" | "No tenemos pendiente";

export interface Activity {
    id: string;
    cliente: string;
    encargado: string;
    ejecutor: string;
    fechaCorte: number;
    status: StatusPendiente;
    pendientePrincipal: string;
    categoria: 'Contenido' | 'Ads' | 'Web' | 'Ventas';
}

export const mockData: Activity[] = [
  // Contenido
  { id: "c1", cliente: "DELICIAS", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Revisar estrategia de contenido Q4", categoria: 'Contenido' },
  { id: "c2", cliente: "DEASA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Aprobación de parrilla de noviembre", categoria: 'Contenido' },
  { id: "c3", cliente: "CREDITOS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 15, status: "No tenemos pendiente", pendientePrincipal: "Escritura de 2 nuevos artículos para blog", categoria: 'Contenido' },
  { id: "c4", cliente: "Shaddai", encargado: "Julio", ejecutor: "Julio", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Planificar calendario de publicaciones de Diciembre", categoria: 'Contenido' },
  // Ads
  { id: "a1", cliente: "DEASA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 30, status: "Trabajando", pendientePrincipal: "Lanzar campaña de Google Ads 'Fin de Año'", categoria: 'Ads' },
  { id: "a2", cliente: "Calzones", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Esperando creativos para campaña de San Valentín", categoria: 'Ads' },
  { id: "a3", cliente: "Sinube Pauta", encargado: "Julio", ejecutor: "Bere", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Optimización de presupuesto de pauta", categoria: 'Ads' },
  { id: "a4", cliente: "MEDICAL TOWER", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "No tenemos pendiente", pendientePrincipal: "Reporte de rendimiento de campaña de Octubre", categoria: 'Ads' },
  // Web
  { id: "w1", cliente: "CREDITOS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Optimización SEO de la landing page 'Préstamos'", categoria: 'Web' },
  { id: "w2", cliente: "PROPERTY TRADERS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Esperando fotos para nueva sección de 'Desarrollos'", categoria: 'Web' },
  { id: "w3", cliente: "ALDO", encargado: "Carlos", ejecutor: "Carlos", fechaCorte: 30, status: "No tenemos pendiente", pendientePrincipal: "Actualización de plugins del sitio", categoria: 'Web' },
  { id: "w4", cliente: "KIBOOK", encargado: "Fany", ejecutor: "Dani", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Desarrollo de nueva funcionalidad de carrito", categoria: 'Web' },
];
