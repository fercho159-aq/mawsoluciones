

"use server";

import { db } from "@/lib/db";
import { cuentasPorCobrar, movimientosDiarios, type NewCuentaPorCobrar, type CuentaPorCobrar, type MovimientoDiario, type NewMovimientoDiario } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
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

export async function addCpc(data: Omit<NewCuentaPorCobrar, 'id'>): Promise<{cpc: CuentaPorCobrar}> {
    try {
        const [newCpc] = await db.insert(cuentasPorCobrar).values(data).returning();
        
        if (!newCpc) {
            throw new Error("Failed to create the cpc record.");
        }

        // Create a corresponding movement with a 'Pendiente' status
        await db.insert(movimientosDiarios).values({
            fecha: new Date(),
            tipo: 'Ingreso',
            descripcion: `Ingreso (pendiente) de ${data.clienteName} por ${data.tipo}`,
            monto: data.monto,
            cuenta: 'Pendiente', // This marks it as an unpaid receivable
            categoria: data.tipo,
            cpcId: newCpc.id, 
        });

        revalidatePath("/equipo/dashboard/finanzas");
        return { cpc: newCpc };

    } catch (error: any) {
        console.error("Error adding cpc:", error);
        throw new Error(error.message || "Could not add cpc");
    }
}


export async function updateCpc(id: number, data: Partial<Omit<NewCuentaPorCobrar, 'id' | 'clienteId' | 'clienteName'>>) {
    try {
        const [updatedCpc] = await db.update(cuentasPorCobrar).set(data).where(eq(cuentasPorCobrar.id, id)).returning();
        
        // Also update the corresponding pending movement
        if (updatedCpc) {
            await db.update(movimientosDiarios).set({
                monto: data.monto,
                descripcion: `Ingreso (pendiente) de ${updatedCpc.clienteName} por ${data.tipo || updatedCpc.tipo}`,
                categoria: data.tipo,
            }).where(eq(movimientosDiarios.cpcId, id));
        }

        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error updating cpc:", error);
        throw new Error(error.message || "Could not update cpc");
    }
}

export async function registrarPagoCpc(cpcId: number, cuentaDestino: string, detalleCuenta: string | null) {
     try {
        // First, find the corresponding pending movement.
        const movimiento = await db.query.movimientosDiarios.findFirst({
            where: and(eq(movimientosDiarios.cpcId, cpcId), eq(movimientosDiarios.cuenta, 'Pendiente'))
        });

        if (!movimiento) {
             // If no pending movement is found, it might have been already paid or there's an inconsistency.
             // We still try to delete the account receivable.
             await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, cpcId));
             revalidatePath("/equipo/dashboard/finanzas");
             console.warn(`CPC record ${cpcId} deleted, but no corresponding PENDING movement was found to update.`);
             return;
        }

        // Update the found movement from 'Pendiente' to a real account
        await db.update(movimientosDiarios)
            .set({ 
                cuenta: cuentaDestino,
                detalleCuenta: detalleCuenta,
                descripcion: movimiento.descripcion.replace(' (pendiente)', '') || 'Ingreso registrado',
                // We DO NOT update the date, so it stays in the original month
            })
            .where(eq(movimientosDiarios.id, movimiento.id)); // Use the specific movement ID

        // Finally, delete the account receivable record
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, cpcId));
            
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error registering cpc payment:", error);
        throw new Error(error.message || "Could not register cpc payment");
    }
}


export async function deleteCpc(id: number) {
    try {
        // When deleting a CPC, we also delete the associated pending movement
        await db.delete(movimientosDiarios).where(eq(movimientosDiarios.cpcId, id));
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

export async function updateMovimiento(id: number, data: Partial<Omit<NewMovimientoDiario, 'id'>>) {
    try {
        await db.update(movimientosDiarios).set(data).where(eq(movimientosDiarios.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error updating movimiento:", error);
        throw new Error(error.message || "Could not update movimiento");
    }
}

export async function deleteMovimiento(id: number) {
    try {
        await db.delete(movimientosDiarios).where(eq(movimientosDiarios.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error deleting movimiento:", error);
        throw new Error(error.message || "Could not delete movimiento");
    }
}
