"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addNoteSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  content: z.string().trim().min(1, "Note content is required"),
});

export async function addNote({
  orderId,
  content,
}: {
  orderId: string;
  content: string;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    // FIX: Pass the object { orderId, content } instead of just content
    const parsed = addNoteSchema.safeParse({ orderId, content });

    if (!parsed.success) {
      return { success: false, error: "Invalid data provided." };
    }

    const newNote = await prisma.note.create({
      data: {
        orderId: parsed.data.orderId,
        content: parsed.data.content,
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return { success: true, data: newNote };
  } catch (error) {
    console.error("Failed to add note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add note",
    };
  }
}

export async function deleteNote({
  orderId,
  noteId,
}: {
  orderId: string;
  noteId: string;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const deletedNote = await prisma.note.delete({
      where: {
        id: noteId,
        orderId,
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return { success: true, data: deletedNote };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete note",
    };
  }
}
