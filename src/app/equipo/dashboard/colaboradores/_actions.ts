
"use server";

// NOTE: This file is currently not used by the page, as it reads from static data.
// It's kept for potential future database integration.

import { db } from "@/lib/db";
import { colaboradores, NewColaborador } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getColaboradores() {
  try {
    const allColaboradores = await db.query.colaboradores.findMany();
    return allColaboradores;
  } catch (error) {
    console.error("Error fetching colaboradores:", error);
    return [];
  }
}

export async function addColaborador(data: NewColaborador) {
  try {
     // Basic validation
    if (!data.name || !data.username || !data.email || !data.role || !data.password) {
        throw new Error("Missing required fields for new collaborator.");
    }
    
    await db.insert(colaboradores).values({
        ...data,
        id: data.username, // Using username as ID for simplicity
        color: '#'+(Math.random()*0xFFFFFF<<0).toString(16).padStart(6,'0'), // Random color
    });
    revalidatePath("/equipo/dashboard/colaboradores");
  } catch (error) {
    console.error("Error adding collaborator:", error);
    throw new Error("Could not add collaborator. Username or email might already exist.");
  }
}

export async function updateColaborador(id: string, data: Partial<NewColaborador>) {
  try {
    await db.update(colaboradores).set(data).where(eq(colaboradores.id, id));
    revalidatePath("/equipo/dashboard/colaboradores");
  } catch (error) {
    console.error("Error updating collaborator:", error);
    throw new Error("Could not update collaborator.");
  }
}
