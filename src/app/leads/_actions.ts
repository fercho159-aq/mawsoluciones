
"use server";

import { db } from "@/lib/db";
import { prospects_maw, type NewProspect } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

const responsables: ("Alma" | "Fer" | "Julio")[] = ["Alma", "Fer", "Julio"];
let lastSellerIndex = 0;

export async function addLead(data: Partial<Omit<NewProspect, 'id' | 'createdAt'>>) {
  try {
    const newSeller = responsables[lastSellerIndex % responsables.length];
    lastSellerIndex = (lastSellerIndex + 1) % responsables.length;

    await db.insert(prospects_maw).values({
        name: data.name || data.company,
        company: data.company,
        phone: data.phone,
        email: data.email,
        source: 'Sitio Web',
        status: 'Lead Nuevo',
        responsable: newSeller,
        // data: data.data, // This field is no longer in prospects_maw, but was in leads. Removing.
    });
    
    revalidatePath("/equipo/dashboard/ventas"); 

  } catch (error) {
    console.error("Error adding lead to prospects_maw:", error);
    // We don't want to throw an error to the client, just log it.
    // The main functionality for the user is sending the WhatsApp message.
  }
}
