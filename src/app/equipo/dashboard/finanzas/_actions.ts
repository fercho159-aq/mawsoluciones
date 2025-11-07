

"use server";

import { db } from "@/lib/db";
import { cuentasPorCobrar, movimientosDiarios, type NewCuentaPorCobrar, type CuentaPorCobrar, type NewMovimientoDiario } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCuentasPorCobrar() {
  try {
    const allCpc = await db.query.cuentasPorCobrar.findMany();
    return allCpc;
  } catch (error) {
    console.error("Error fetching cpc:", error);
    return [];
  }
}

export async function getMovimientos() {
  try {
    const allMovimientos = await db.query.movimientosDiarios.findMany({
        orderBy: [desc(movimientosDiarios.fecha)],
    });
    return allMovimientos;
  } catch (error) {
    console.error("Error fetching movimientos:", error);
    return [];
  }
}

export async function addCpc(data: Omit<NewCuentaPorCobrar, 'id'>) {
    try {
        // Add to Cuentas por Cobrar
        await db.insert(cuentasPorCobrar).values(data);
        
        // Also add as an Income to Movimientos Diarios
        await db.insert(movimientosDiarios).values({
            fecha: new Date(),
            tipo: 'Ingreso',
            descripcion: `Ingreso (pendiente) de ${data.clienteName} por ${data.tipo}`,
            monto: data.monto,
            cuenta: 'Pendiente', // Marcar como pendiente hasta que se cobre
            categoria: data.tipo,
        });

        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error adding cpc:", error);
        throw new Error(error.message || "Could not add cpc");
    }
}


export async function updateCpc(id: number, data: Partial<Omit<NewCuentaPorCobrar, 'id' | 'clienteId' | 'clienteName'>>) {
    try {
        await db.update(cuentasPorCobrar).set(data).where(eq(cuentasPorCobrar.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error updating cpc:", error);
        throw new Error(error.message || "Could not update cpc");
    }
}

export async function deleteCpc(id: number) {
    try {
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error deleting cpc:", error);
        throw new Error(error.message || "Could not delete cpc");
    }
}


export async function addMovimiento(data: Omit<NewMovimientoDiario, 'id'>) {
  try {
    await db.insert(movimientosDiarios).values(data);
    revalidatePath("/equipo/dashboard/finanzas");
  } catch (error: any) {
    console.error("Error adding movimiento:", error);
    throw new Error(error.message || "Could not add movimiento");
  }
}
