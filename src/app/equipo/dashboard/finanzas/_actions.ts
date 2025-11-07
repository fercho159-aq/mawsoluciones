

"use server";

import { db } from "@/lib/db";
import { cuentasPorCobrar, movimientosDiarios, type NewCuentaPorCobrar, type CuentaPorCobrar, type NewMovimientoDiario } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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
        orderBy: [eq(movimientosDiarios.fecha, 'desc')],
    });
    return allMovimientos;
  } catch (error) {
    console.error("Error fetching movimientos:", error);
    return [];
  }
}

export async function addCpc(data: Omit<NewCuentaPorCobrar, 'id'>): Promise<{cpc: CuentaPorCobrar, movimiento: MovimientoDiario}> {
    try {
        // 1. Insertar en Cuentas por Cobrar
        const [newCpc] = await db.insert(cuentasPorCobrar).values(data).returning();
        
        if (!newCpc) {
            throw new Error("Failed to create the cpc record.");
        }

        // 2. Insertar como un Ingreso pendiente en Movimientos Diarios
        const [newMovimiento] = await db.insert(movimientosDiarios).values({
            fecha: new Date(),
            tipo: 'Ingreso',
            descripcion: `Ingreso (pendiente) de ${data.clienteName} por ${data.tipo}`,
            monto: data.monto,
            cuenta: 'Pendiente', // Marcar como pendiente hasta que se cobre
            categoria: data.tipo,
            cpcId: newCpc.id, // Link to the cpc record
        }).returning();

        if (!newMovimiento) {
             // Rollback logic could be added here if the DB supported transactions
            await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, newCpc.id));
            throw new Error("Failed to create the corresponding movimiento record.");
        }

        revalidatePath("/equipo/dashboard/finanzas");
        return { cpc: newCpc, movimiento: newMovimiento };

    } catch (error: any) {
        console.error("Error adding cpc:", error);
        throw new Error(error.message || "Could not add cpc");
    }
}


export async function updateCpc(id: number, data: Partial<Omit<NewCuentaPorCobrar, 'id' | 'clienteId' | 'clienteName'>>) {
    try {
        const [updatedCpc] = await db.update(cuentasPorCobrar).set(data).where(eq(cuentasPorCobrar.id, id)).returning();
        
        // Also update the related movimiento if amount or description changes
        if (updatedCpc && (data.monto || data.tipo)) {
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
        // 1. Marcar la cuenta por cobrar como pagada (o eliminarla)
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, cpcId));

        // 2. Actualizar el movimiento diario correspondiente para reflejar el pago
        await db.update(movimientosDiarios)
            .set({ 
                cuenta: cuentaDestino,
                detalleCuenta: detalleCuenta,
                descripcion: `Ingreso de ${(await db.query.movimientosDiarios.findFirst({ where: eq(movimientosDiarios.cpcId, cpcId) }))?.descripcion.replace(' (pendiente)', '')}`
            })
            .where(eq(movimientosDiarios.cpcId, cpcId));
            
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error registering cpc payment:", error);
        throw new Error(error.message || "Could not register cpc payment");
    }
}


export async function deleteCpc(id: number) {
    try {
        // Also delete the associated pending movimiento
        await db.delete(movimientosDiarios).where(
            and(
                eq(movimientosDiarios.cpcId, id), 
                eq(movimientosDiarios.cuenta, 'Pendiente')
            ));
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
