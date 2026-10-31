"use client";

import { addNote } from "@/actions/admin/note-mutations";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/utils/get-error-message";
import { noteSchema, type NoteInput } from "@/validation/note.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const defaultValues: NoteInput = {
  content: "",
};

export function AddNoteForm({ orderId }: { orderId: string }) {
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NoteInput) => {
      const res = await addNote({ orderId, content: data.content });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      reset(defaultValues);
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: NoteInput) => {
    setFormError(null);
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {formError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="font-medium">{formError}</p>
        </div>
      )}

      <Controller
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <Textarea
              aria-label="New note"
              placeholder="Add an internal note. Customers cannot see it."
              className="min-h-20 resize-none"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving..." : "Add Note"}
        </Button>
      </div>
    </form>
  );
}
