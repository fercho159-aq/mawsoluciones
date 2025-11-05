
import { addDays, startOfMonth } from 'date-fns';

export type Evento = {
  id: string;
  date: Date;
  title: string;
  client: string;
  type: 'grabacion' | 'cita' | 'llamada';
  responsable: 'Alma' | 'Julio' | 'Fany' | 'Luis' | 'Carlos' | 'Fer' | string;
};

const today = new Date();
const startOfToday = startOfMonth(today);

export const mockEvents: Evento[] = [
  { id: "evt1", date: addDays(startOfToday, 2), title: "Grabación Biofert", client: "Biofert", type: 'grabacion', responsable: 'Fany' },
  { id: "evt2", date: addDays(startOfToday, 2), title: "Videollamada con Prospecto 'Tacos El Veloz'", client: "Tacos El Veloz", type: 'cita', responsable: 'Julio' },
  { id: "evt3", date: addDays(startOfToday, 4), title: "Llamada de seguimiento 'Constructora Edifica'", client: "Constructora Edifica", type: 'llamada', responsable: 'Alma' },
  { id: "evt4", date: addDays(startOfToday, 9), title: "Grabación UROLOGO", client: "UROLOGO", type: 'grabacion', responsable: 'Luis' },
  { id: "evt5", date: addDays(startOfToday, 9), title: "Cita de cierre 'Clínica Dental Sonrisa'", client: "Clínica Dental Sonrisa", type: 'cita', responsable: 'Fer' },
  { id: "evt6", date: addDays(startOfToday, 15), title: "Grabación Benja", client: "Benja", type: 'grabacion', responsable: 'Fany' },
  { id: "evt7", date: addDays(startOfToday, 17), title: "Videollamada de Demo 'Restaurante La Toscana'", client: "Restaurante La Toscana", type: 'cita', responsable: 'Julio' },
  { id: "evt8", date: addDays(startOfToday, 24), title: "Grabación para Redes", client: "Redes Internas", type: 'grabacion', responsable: 'Carlos' },
];

export type StatusPendiente = "Pendiente del cliente" | "Trabajando" | "No tenemos pendiente";

export interface Pendiente {
    id: string;
    cliente: string;
    encargado: string;
    ejecutor: string;
    fechaCorte: number;
    status: StatusPendiente;
    pendientePrincipal: string;
    categoria: 'Contenido' | 'Ads' | 'Web';
}

export const mockData: Pendiente[] = [
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
