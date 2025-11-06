
"use server";

import { db } from "@/lib/db";
import { leads, type NewLead } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    const allLeads = await db.query.leads.findMany({
      orderBy: [desc(leads.createdAt)],
    });
    return allLeads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function addProspect(data: Partial<Omit<NewLead, 'id' | 'createdAt' | 'data'>>) {
    try {
        await db.insert(leads).values({
            name: data.name,
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
