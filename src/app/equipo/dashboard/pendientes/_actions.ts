
"use server";

import { db } from "@/lib/db";
import { pendientes, subTasks, recordingEvents, NewRecordingEvent } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPendientes() {
    try {
        const allPendientes = await db.query.pendientes.findMany({
            with: {
                subTasks: true,
                recordingEvent: true
            },
        });
        return allPendientes;
    } catch (error) {
        console.error("Error fetching pendientes:", error);
        return [];
    }
}

export type NewPendienteData = Omit<typeof pendientes.$inferInsert, 'id' | 'createdAt'>;

export async function addPendiente(data: NewPendienteData) {
    try {
        await db.insert(pendientes).values(data);
        revalidatePath("/equipo/dashboard/pendientes");
    } catch (error) {
        console.error("Error adding pendiente:", error);
        throw new Error("Could not add pendiente");
    }
}

export async function updatePendiente(id: number, data: Partial<NewPendienteData>) {
    try {
        await db.update(pendientes).set(data).where(eq(pendientes.id, id));
        revalidatePath("/equipo/dashboard/pendientes");
    } catch (error) {
        console.error("Error updating pendiente:", error);
        throw new Error("Could not update pendiente");
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

export async function scheduleRecording(data: Omit<NewRecordingEvent, 'id'>) {
    try {
        // Check if an event for this pendiente already exists
        const existingEvent = await db.query.recordingEvents.findFirst({
            where: data.pendienteId ? eq(recordingEvents.pendienteId, data.pendienteId) : undefined,
        });

        if (existingEvent) {
            // Update
            await db.update(recordingEvents).set(data).where(eq(recordingEvents.id, existingEvent.id));
        } else {
            // Insert
            await db.insert(recordingEvents).values(data);
        }
        revalidatePath("/equipo/dashboard/pendientes");
        revalidatePath("/equipo/dashboard/calendario");
    } catch (error) {
        console.error("Error scheduling recording:", error);
        throw new Error("Could not schedule recording");
    }
}

export async function deleteRecording(pendienteId: number) {
    try {
        await db.delete(recordingEvents).where(eq(recordingEvents.pendienteId, pendienteId));
        revalidatePath("/equipo/dashboard/pendientes");
        revalidatePath("/equipo/dashboard/calendario");
    } catch (error) {
        console.error("Error deleting recording:", error);
        throw new Error("Could not delete recording");
    }
}

export async function getRecordingEvents() {
    try {
        const events = await db.query.recordingEvents.findMany();
        return events;
    } catch (error) {
        console.error("Error fetching recording events:", error);
        return [];
    }
}
