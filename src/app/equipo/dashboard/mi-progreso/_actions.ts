
"use server";

import { db } from "@/lib/db";
import { como_voy_en_mis_finanzas, NewComoVoyEnMisFinanzas } from "@/lib/db/schema";
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from "next/cache";

export type PersonalFinanceTransaction = Omit<NewComoVoyEnMisFinanzas, 'id'> & { id?: number };

export async function getPersonalFinance() {
    try {
        const data = await db.query.como_voy_en_mis_finanzas.findMany();
        return data;
    } catch (error) {
        console.error("Error fetching personal finance data:", error);
        return [];
    }
}

export async function updatePersonalFinanceEntry(entry: PersonalFinanceTransaction) {
    try {
        const { fecha, categoria, ...rest } = entry;
        const entryDate = new Date(fecha);
        if (isNaN(entryDate.getTime())) {
            throw new Error('Invalid date provided for personal finance entry.');
        }

        const year = entryDate.getUTCFullYear();
        const month = entryDate.getUTCMonth();

        // Buscar si ya existe una entrada para esa categoría en ese mes y año
        const existingEntries = await db.select().from(como_voy_en_mis_finanzas).where(
            and(
                eq(como_voy_en_mis_finanzas.categoria, categoria),
                eq(sql`EXTRACT(MONTH FROM fecha)`, month + 1),
                eq(sql`EXTRACT(YEAR FROM fecha)`, year)
            )
        );

        if (existingEntries.length > 0) {
            // Si existen, las actualizamos (o la primera, si hay varias)
            const idToUpdate = existingEntries[0].id;
            await db.update(como_voy_en_mis_finanzas).set({
                monto: Math.abs(rest.monto), // Guardar siempre como positivo
                tipo: rest.monto >= 0 ? 'INGRESO' : 'GASTO',
                descripcion: rest.descripcion || `${categoria} - ${entryDate.toLocaleString('es-MX', { month: 'long' })}`,
            }).where(eq(como_voy_en_mis_finanzas.id, idToUpdate));

        } else {
             // Si no existe, creamos una nueva entrada
            await db.insert(como_voy_en_mis_finanzas).values({
                fecha: entryDate,
                categoria,
                monto: Math.abs(rest.monto),
                tipo: rest.monto >= 0 ? 'INGRESO' : 'GASTO',
                descripcion: rest.descripcion || `${categoria} - ${entryDate.toLocaleString('es-MX', { month: 'long' })}`,
                cuenta: 'Efectivo',
            });
        }

        revalidatePath('/equipo/dashboard/mi-progreso');

    } catch (error) {
        console.error("Error updating personal finance entry:", error);
        throw new Error("No se pudo actualizar la entrada financiera.");
    }
}
