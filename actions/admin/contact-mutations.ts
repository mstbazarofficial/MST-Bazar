"use server";

import { ContactStatus } from "@/generated/prisma/enums";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates the status of a contact submission
 */
export async function updateContactStatus(id: string, status: ContactStatus) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/contacts");
    return { success: true, message: "Status updated successfully" };
  } catch (error) {
    console.error("[UPDATE_CONTACT_STATUS_ERROR]:", error);
    throw new Error("Failed to update contact status.");
  }
}

/**
 * Deletes a contact submission
 * Compatible with DeleteDialogActionType: Promise<ActionResult | boolean | void>
 */
export async function deleteContact(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    await prisma.contactSubmission.delete({
      where: { id },
    });

    revalidatePath("/admin/contacts");
    return { success: true, message: "Contact submission deleted." };
  } catch (error) {
    console.error("[DELETE_CONTACT_ERROR]:", error);
    return { success: false, message: "Failed to delete contact submission." };
  }
}
