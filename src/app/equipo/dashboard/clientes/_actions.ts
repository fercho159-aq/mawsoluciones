"use server";

import { db } from "@/lib/db";
import { clients, pendientes } from "@/lib/db/schema";
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
    const { responsables, ...clientData } = data;
    
    const newClient = await db.insert(clients).values(clientData).returning();
    const createdClient = newClient[0];

    if (responsables && createdClient) {
        const newPendientes = [];
        if (data.managedAreas?.includes('Contenido') && responsables.contenido) {
            newPendientes.push({
                cliente: createdClient.name,
                encargado: responsables.contenido.encargado,
                ejecutor: responsables.contenido.ejecutor,
                fechaCorte: 15,
                status: 'Trabajando' as const,
                pendientePrincipal: `Kick-off y estrategia de contenido para ${createdClient.name}`,
                categoria: 'Contenido' as const,
            });
        }
        if (data.managedAreas?.includes('Ads') && responsables.ads) {
             newPendientes.push({
                cliente: createdClient.name,
                encargado: responsables.ads.responsable, // Asumiendo que el responsable es encargado y ejecutor inicial
                ejecutor: responsables.ads.responsable,
                fechaCorte: 15,
                status: 'Trabajando' as const,
                pendientePrincipal: `Configuración de campaña de Ads para ${createdClient.name}`,
                categoria: 'Ads' as const,
            });
        }
        if (data.managedAreas?.includes('Web') && responsables.web) {
             newPendientes.push({
                cliente: createdClient.name,
                encargado: responsables.web.responsable,
                ejecutor: responsables.web.responsable,
                fechaCorte: 15,
                status: 'Trabajando' as const,
                pendientePrincipal: `Planificación y desarrollo web para ${createdClient.name}`,
                categoria: 'Web' as const,
            });
        }

        if (newPendientes.length > 0) {
            await db.insert(pendientes).values(newPendientes);
        }
    }

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