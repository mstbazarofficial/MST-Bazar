import { z } from "zod";

export const noteSchema = z.object({
  content: z.string().trim().min(1, "Note content cannot be empty."),
});

export type NoteInput = z.input<typeof noteSchema>;
