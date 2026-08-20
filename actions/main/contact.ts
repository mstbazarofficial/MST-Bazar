"use server";

import { prisma } from "@/lib/prisma";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/validation/contact.validation";

export async function submitContactForm(data: ContactFormValues) {
  const validated = contactFormSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: "Validation failed. Please review your input and try again.",
    };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        orderId: validated.data.orderId || null,
        message: validated.data.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating contact submission:", error);
    return {
      success: false,
      error:
        "Something went wrong while sending your message. Please try again.",
    };
  }
}
