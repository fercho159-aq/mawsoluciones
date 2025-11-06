
"use server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const allClients = await db.query.clients.findMany();
    return allClients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export type NewClientData = Omit<typeof clients.$inferInsert, 'id' | 'createdAt'> & {
    responsables?: {
        contenido?: { encargado: string; ejecutor: string };
        ads?: { responsable: string };
        web?: { responsable: string };
    }
};

export async function addClient(data: NewClientData) {
  try {
    await db.insert(clients).values({
        name: data.name,
        representativeName: data.representativeName,
        whatsapp: data.whatsapp,
        email: data.email,
        managedAreas: data.managedAreas
    }).returning();
    revalidatePath("/equipo/dashboard/clientes");
    revalidatePath("/equipo/dashboard/pendientes");
  } catch (error) {
    console.error("Error adding client:", error);
    throw new Error("Could not add client");
  }
}

export async function updateClient(id: number, data: Partial<Omit<typeof clients.$inferInsert, 'id' | 'createdAt'>>) {
  try {
    await db.update(clients).set(data).where(eq(clients.id, id));
    revalidatePath("/equipo/dashboard/clientes");
  } catch (error) {
    console.error("Error updating client:", error);
    throw new Error("Could not update client");
  }
}
