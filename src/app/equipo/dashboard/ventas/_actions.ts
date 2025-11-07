
"use server";

import { db } from "@/lib/db";
import { prospects_maw, type NewProspect } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { addClient, type NewClientData } from '../clientes/_actions';


export async function getProspects() {
  try {
    const allProspects = await db.query.prospects_maw.findMany({
      orderBy: [desc(prospects_maw.createdAt)],
    });
    return allProspects;
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return [];
  }
}

const responsables: ("Alma" | "Fer" | "Julio")[] = ["Alma", "Fer", "Julio"];
let lastSellerIndex = 0;

export async function addMawProspect(data: Partial<Omit<NewProspect, 'id' | 'createdAt'>>) {
    try {
        const newSeller = responsables[lastSellerIndex % responsables.length];
        lastSellerIndex = (lastSellerIndex + 1) % responsables.length;

        await db.insert(prospects_maw).values({
            name: data.name || data.company,
            company: data.company,
            phone: data.phone,
            email: data.email,
            source: data.source || 'Manual',
            status: 'Lead Nuevo',
            responsable: newSeller,
        });
        revalidatePath("/equipo/dashboard/ventas");
    } catch (error) {
        console.error("Error adding prospect:", error);
        throw new Error("No se pudo añadir el prospecto.");
    }
}

export async function convertProspectToClient(prospectId: number, clientData: NewClientData) {
    try {
        // 1. Update prospect status to 'Convertido'
        await db.update(prospects_maw).set({ status: 'Convertido' }).where(eq(prospects_maw.id, prospectId));

        // 2. Add the new client using the existing action
        await addClient(clientData);

        // 3. Revalidate paths for both pages
        revalidatePath('/equipo/dashboard/ventas');
        revalidatePath('/equipo/dashboard/clientes');
        revalidatePath('/equipo/dashboard/pendientes');

    } catch (error) {
        console.error("Error converting prospect to client:", error);
        throw new Error("No se pudo convertir el prospecto a cliente.");
    }
}
