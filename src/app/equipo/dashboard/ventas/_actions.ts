
"use server";

import { db } from "@/lib/db";
import { prospects_maw, type NewProspect } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
