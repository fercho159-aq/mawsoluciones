"use server";

import { db } from "@/lib/db";
import { pendientes, subTasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPendientes() {
    try {
        const allPendientes = await db.query.pendientes.findMany({
            with: {
                subTasks: true,
            },
        });
        return allPendientes;
    } catch (error) {
        console.error("Error fetching pendientes:", error);
        return [];
    }
}

export async function addSubTask(data: typeof subTasks.$inferInsert) {
    try {
        const newSubTask = await db.insert(subTasks).values(data).returning();
        revalidatePath("/equipo/dashboard/pendientes");
        return newSubTask[0];
    } catch (error) {
        console.error("Error adding subtask:", error);
        throw new Error("Could not add subtask");
    }
}

export async function toggleSubTask(id: number, completed: boolean) {
    try {
        await db.update(subTasks).set({ completed }).where(eq(subTasks.id, id));
        revalidatePath("/equipo/dashboard/pendientes");
    } catch (error) {
        console.error("Error toggling subtask:", error);
        throw new Error("Could not toggle subtask");
    }
}
