"use server";

import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { TeamMember } from "@/lib/team-data";

export async function updateUserProfile(id: string, data: Partial<TeamMember>) {
  try {
    const [updatedUser] = await db.update(teamMembers)
      .set(data)
      .where(eq(teamMembers.id, id))
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
