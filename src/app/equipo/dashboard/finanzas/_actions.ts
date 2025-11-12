

"use server";

import { db } from "@/lib/db";
import { cuentasPorCobrar, movimientosDiarios, type NewCuentaPorCobrar, type CuentaPorCobrar, type MovimientoDiario, type NewMovimientoDiario } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const IVA_RATE = 0.16;

export async function getCuentasPorCobrar() {
  try {
    const allCpc = await db.query.cuentasPorCobrar.findMany({
        orderBy: [desc(cuentasPorCobrar.id)],
    });
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
        revalidatePath("/equipo/dashboard/finanzas");
        return { cpc: newCpc };

    } catch (error: any) {
        console.error("Error adding cpc:", error);
        throw new Error(error.message || "Could not add cpc");
    }
}


export async function updateCpc(id: number, data: Partial<Omit<NewCuentaPorCobrar, 'id' | 'clienteId' | 'clienteName'>>) {
    try {
        await db.update(cuentasPorCobrar).set(data).where(eq(cuentasPorCobrar.id, id)).returning();
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error updating cpc:", error);
        throw new Error(error.message || "Could not update cpc");
    }
}

export async function registrarPagoCpc(cpcId: number, cuentaDestino: string, detalleCuenta: string | null) {
     try {
        // 1. Get the details from the cpc record
        const cpcToPay = await db.query.cuentasPorCobrar.findFirst({
            where: eq(cuentasPorCobrar.id, cpcId),
        });
        
        if (!cpcToPay) {
            throw new Error("La cuenta por cobrar que intentas pagar ya no existe.");
        }

        const ivaAmount = cpcToPay.conIva ? cpcToPay.monto * IVA_RATE : null;

        // 2. Create a new movement in movimientosDiarios, like a manual income
        await db.insert(movimientosDiarios).values({
            fecha: new Date(), // Use current date for the payment
            tipo: 'Ingreso',
            descripcion: cpcToPay.concepto || `Pago de ${cpcToPay.clienteName} - ${cpcToPay.tipo} (${cpcToPay.periodo})`,
            monto: cpcToPay.monto,
            cuenta: cuentaDestino,
            detalleCuenta: detalleCuenta,
            categoria: cpcToPay.tipo,
            cpcId: cpcToPay.id, // Keep the reference
            conIva: cpcToPay.conIva,
            iva: ivaAmount,
        });

        // 3. Delete the cpc record now that it's paid
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, cpcId));
            
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error registering cpc payment:", error);
        throw new Error(error.message || "Could not register cpc payment");
    }
}


export async function deleteCpc(id: number) {
    try {
        // Just delete the cpc, no related movement to delete anymore from this action.
        await db.delete(cuentasPorCobrar).where(eq(cuentasPorCobrar.id, id));
        revalidatePath("/equipo/dashboard/finanzas");
    } catch (error: any) {
        console.error("Error deleting cpc:", error);
        throw new Error(error.message || "Could not delete cpc");
    }
}


export async function addMovimiento(data: Omit<NewMovimientoDiario, 'id' | 'iva'> & { conIva?: boolean }) {
  try {
    const ivaAmount = data.conIva ? data.monto * IVA_RATE : null;
    await db.insert(movimientosDiarios).values({
        ...data,
        iva: ivaAmount,
    });
    revalidatePath("/equipo/dashboard/finanzas");
  } catch (error: any) {
    console.error("Error adding movimiento:", error);
    throw new Error(error.message || "Could not add movimiento");
  }
}

export async function updateMovimiento(id: number, data: Partial<Omit<NewMovimientoDiario, 'id' | 'iva'>> & { conIva?: boolean }) {
    try {
        const monto = data.monto;
        const updates: Partial<NewMovimientoDiario> = { ...data };

        if(monto !== undefined && 'conIva' in data) {
             updates.iva = data.conIva ? monto * IVA_RATE : null;
        } else if ('conIva' in data && data.conIva === false) {
             updates.iva = null;
        }

        await db.update(movimientosDiarios).set(updates).where(eq(movimientosDiarios.id, id));
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
