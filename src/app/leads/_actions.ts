
"use server";

import { db } from "@/lib/db";
import { leads, type NewLead } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function addLead(data: Omit<NewLead, 'id' | 'createdAt'>) {
  try {
    await db.insert(leads).values(data);
    
    // This is optional, but good practice if you have a page that displays leads
    revalidatePath("/equipo/dashboard/ventas"); 

  } catch (error) {
    console.error("Error adding lead:", error);
    // We don't want to throw an error to the client, just log it.
    // The main functionality for the user is sending the WhatsApp message.
  }
}
