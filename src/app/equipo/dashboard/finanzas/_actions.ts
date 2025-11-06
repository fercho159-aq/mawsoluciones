
"use server";

import { db } from "@/lib/db";
import { cuentasPorCobrar, movimientosDiarios, type NewCuentaPorCobrar, type CuentaPorCobrar, finanzas_final, NewMovimientoDiario } from "@/lib/db/schema";
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
        await db.insert(cuentasPorCobrar).values({
            ...data,
        });
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error) {
        console.error("Error adding cpc:", error);
        throw new Error("Could not add cpc");
    }
}


export async function updateCpc(id: number, data: Partial<Omit<NewCuentaPorCobrar, 'id'>>) {
    try {
        await db.update(cuentasPorCobrar).set(data).where(eq(cuentasPorCobrar.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error) {
        console.error("Error updating cpc:", error);
        throw new Error("Could not update cpc");
    }
}


export async function addMovimiento(data: Omit<NewMovimientoDiario, 'id'>) {
  try {
    await db.insert(movimientosDiarios).values(data);
    revalidatePath("/equipo/dashboard/finanzas");
  } catch (error) {
    console.error("Error adding movimiento:", error);
    throw new Error("Could not add movimiento");
  }
}

export async function updateCpcAfterPayment(cpc: CuentaPorCobrar, nextPeriod: string) {
    try {
        // Delete the paid CPC
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, cpc.id));

        // If it's a recurring payment, create the next one
        if (cpc.tipo === 'Iguala Mensual') {
            await db.insert(cuentasPorCobrar).values({
                clienteId: cpc.clienteId,
                clienteName: cpc.clienteName,
                periodo: nextPeriod,
                monto: cpc.monto,
                tipo: cpc.tipo,
            });
        }

        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error) {
        console.error("Error updating cpc after payment:", error);
        throw new Error("Could not update cpc");
    }
}

