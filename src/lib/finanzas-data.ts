import { parseISO } from 'date-fns';

export type Periodo = string;
export type MovimientoTipo = "Ingreso" | "Gasto";
export type CategoriaIngreso = "Proyecto" | "Iguala Mensual" | "Ads";
export type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros" | "Renta";
export type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Cuenta Aldo" | "Efectivo";

export interface Client {
  id: string;
  name: string;
  representativeName?: string;
  whatsapp?: string;
  email?: string;
}

export interface CuentasPorCobrar {
  id: string;
  clienteId: string;
  clienteName: string;
  periodo: Periodo;
  monto: number;
  tipo: CategoriaIngreso;
}

export interface MovimientoDiario {
  id: string;
  fecha: Date;
  tipo: MovimientoTipo;
  descripcion: string;
  monto: number;
  cuenta: Cuenta | string;
  detalleCuenta?: string;
  categoria?: CategoriaIngreso | CategoriaGasto;
  nombreOtro?: string;
}

export const initialClients: Client[] = [
    { id: 'client-1', name: "Bateiras", representativeName: "Juan Pérez", whatsapp: "5215512345678", email: "contacto@bateiras.com" }
];

export const initialCuentasPorCobrar: CuentasPorCobrar[] = [
  { id: 'cpc1', clienteId: 'client-1', clienteName: 'Bateiras', periodo: "15 Nov - 15 Dic", monto: 3944, tipo: "Ads" },
];

export const initialMovimientosDiarios: MovimientoDiario[] = [
    { id: 'mov-bateiras', fecha: parseISO('2024-11-04T10:00:00'), tipo: 'Ingreso', descripcion: 'Pago cliente Bateiras', monto: 3944, cuenta: 'Cuenta Paola', categoria: 'Ads' },
    { id: 'mov2', fecha: new Date('2024-11-01T09:00:00'), tipo: 'Gasto', descripcion: 'Pago Dani', monto: 9000, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov3', fecha: new Date('2024-11-01T09:01:00'), tipo: 'Gasto', descripcion: 'Pago Didi Den', monto: 9900, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov4', fecha: new Date('2024-11-01T09:02:00'), tipo: 'Gasto', descripcion: 'Renta Abajo', monto: 4500, cuenta: 'Cuenta Aldo', categoria: 'Renta' },
    { id: 'mov5', fecha: new Date('2024-11-01T10:00:00'), tipo: 'Gasto', descripcion: 'Paypal google', monto: 779, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov6', fecha: new Date('2024-11-01T10:01:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1188, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov7', fecha: new Date('2024-11-01T10:02:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1000, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov8', fecha: new Date('2024-11-01T10:03:00'), tipo: 'Gasto', descripcion: 'Paypal shopify', monto: 370, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov9', fecha: new Date('2024-11-01T10:04:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1141, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov10', fecha: new Date('2024-11-01T10:05:00'), tipo: 'Gasto', descripcion: 'Encuadre por centavos', monto: 2, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov11', fecha: new Date('2024-11-03T11:00:00'), tipo: 'Gasto', descripcion: 'Pago Kari', monto: 500, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov12', fecha: new Date('2024-11-03T11:01:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1303, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov13', fecha: new Date('2024-11-05T12:00:00'), tipo: 'Gasto', descripcion: 'Tiktok MAW', monto: 4640, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
];
