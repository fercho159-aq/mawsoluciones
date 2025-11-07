
"use server";

import { db } from "@/lib/db";
import { clients, pendientes_maw, clientFinancialProfiles } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const allClients = await db.query.clients.findMany({
        with: {
            financialProfile: true,
        }
    });
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
    // Simulate fetching follower counts
    const instagramFollowers = data.instagramUrl ? Math.floor(Math.random() * 5000) + 500 : 0;
    const facebookFollowers = data.facebookUrl ? Math.floor(Math.random() * 10000) + 1000 : 0;
    const tiktokFollowers = data.tiktokUrl ? Math.floor(Math.random() * 20000) + 200 : 0;

    const [newClient] = await db.insert(clients).values({
        name: data.name,
        representativeName: data.representativeName,
        whatsapp: data.whatsapp,
        email: data.email,
        managedAreas: data.managedAreas,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        tiktokUrl: data.tiktokUrl,
        instagramFollowers,
        facebookFollowers,
        tiktokFollowers,
    }).returning({ id: clients.id });
    
    // Create financial profile for the new client
    await db.insert(clientFinancialProfiles).values({
        clientId: newClient.id,
    });

    // Create pendientes if areas are selected
    if (data.managedAreas && data.responsables) {
        for (const area of data.managedAreas) {
            let encargado = '';
            let ejecutor = '';
            
            if (area === 'Contenido' && data.responsables.contenido) {
                encargado = data.responsables.contenido.encargado;
                ejecutor = data.responsables.contenido.ejecutor;
            } else if (area === 'Ads' && data.responsables.ads) {
                encargado = data.responsables.ads.responsable;
                ejecutor = data.responsables.ads.responsable; 
            } else if (area === 'Web' && data.responsables.web) {
                encargado = data.responsables.web.responsable;
                ejecutor = data.responsables.web.responsable;
            }

            if (encargado && ejecutor) {
                 await db.insert(pendientes_maw).values({
                    clientId: newClient.id,
                    clienteName: data.name,
                    encargado: encargado,
                    ejecutor: ejecutor,
                    categoria: area,
                    pendientePrincipal: `Kick-off y configuración inicial del área de ${area}.`,
                    status: 'Trabajando',
                    completed: false,
                });
            }
        }
    }

    revalidatePath("/equipo/dashboard/clientes");
    revalidatePath("/equipo/dashboard/pendientes");
    revalidatePath("/equipo/dashboard/finanzas");
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

export async function deleteClients(ids: number[]) {
    try {
        await db.delete(clients).where(inArray(clients.id, ids));
        revalidatePath('/equipo/dashboard/clientes');
    } catch (error) {
        console.error("Error deleting clients:", error);
        throw new Error("Could not delete clients");
    }
}
