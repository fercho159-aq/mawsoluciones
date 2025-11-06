"use server";

import { db } from "@/lib/db";
import { colaboradores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Colaborador } from "@/lib/db/schema";

export async function updateUserProfile(id: string, data: Partial<Colaborador>) {
  try {
    const [updatedUser] = await db.update(colaboradores)
      .set(data)
      .where(eq(colaboradores.id, id))
      .returning();
    
    if (!updatedUser) {
        throw new Error("User not found");
    }

    revalidatePath("/equipo/dashboard/configuracion");
    return updatedUser;

  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Could not update user profile");
  }
}
