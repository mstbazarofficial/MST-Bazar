"use client";

import { addNote } from "@/actions/admin/note-mutations";
import { FormModal } from "@/components/my-ui/form-modal";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/utils/get-error-message";
import { noteSchema, type NoteInput } from "@/validation/note.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const defaultValues: NoteInput = {
  content: "",
};

interface AddNoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
}

export function AddNoteFormModal({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: AddNoteFormModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NoteInput) => {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }

      const res = await addNote({ orderId, content: data.content });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: NoteInput) => {
    setFormError(null);
    mutate(values);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset(defaultValues);
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleModalClose}
      title="Add Note"
      description="Add an internal note to this order. Notes are not visible to customers."
      maxWidth="32rem"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleModalClose(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="add-note-form" disabled={isPending}>
            {isPending ? "Saving..." : "Add Note"}
          </Button>
        </div>
      }
    >
      <form
        id="add-note-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Error Banner */}
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {/* Content Field */}
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Note Content *</FieldLabel>
              <Textarea
                placeholder="e.g. Customer requested delivery after 5 PM..."
                className="min-h-30 resize-none"
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
      </form>
    </FormModal>
  );
}
