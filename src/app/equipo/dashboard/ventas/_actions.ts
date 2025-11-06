
"use server";

import { db } from "@/lib/db";
import { prospects, type NewProspect } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProspects() {
  try {
    const allProspects = await db.query.prospects.findMany({
      orderBy: [desc(prospects.createdAt)],
    });
    return allProspects;
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return [];
  }
}

export async function addSalesProspect(data: Partial<Omit<NewProspect, 'id' | 'createdAt'>>) {
    try {
        await db.insert(prospects).values({
            name: data.name || data.company,
            company: data.company,
            phone: data.phone,
            email: data.email,
            source: data.source,
            status: data.status,
            responsable: data.responsable,
        });
        revalidatePath("/equipo/dashboard/ventas");
    } catch (error) {
        console.error("Error adding prospect:", error);
        throw new Error("Could not add prospect");
    }
}
