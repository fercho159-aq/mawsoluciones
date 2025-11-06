import { parseISO } from 'date-fns';

export type Periodo = string;
export type MovimientoTipo = "Ingreso" | "Gasto";
export type CategoriaIngreso = "Proyecto" | "Iguala Mensual" | "Renovaciones" | "Otros";
export type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros" | "Renta";
export type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Cuenta Aldo" | "Efectivo";

export interface Client {
  id: string;
  name: string;
  representativeName: string;
  whatsapp: string;
  email?: string;
  managedAreas?: string[];
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

export const initialClients: Client[] = [];
export const initialCuentasPorCobrar: CuentasPorCobrar[] = [];
export const initialMovimientosDiarios: MovimientoDiario[] = [];
