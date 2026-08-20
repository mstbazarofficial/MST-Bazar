"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { FormModal } from "@/components/my-ui/form-modal";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Role } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/utils/get-error-message";
import { useRouter } from "next/navigation";

// Schemas for the three different edit modes
const generalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  fullAddress: z.string().optional(),
});

const roleSchema = z.object({
  role: z.enum([Role.ADMIN, Role.MODERATOR, Role.CUSTOMER]),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type EditMode = "general" | "role" | "password" | null;

interface UpdateUserModalProps {
  user: any; // Ideally use your User type here
  editMode: EditMode;
  onClose: () => void;
}

export function UpdateUserModal({
  user,
  editMode,
  onClose,
}: UpdateUserModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  // Determine which schema to use based on mode
  const currentSchema =
    editMode === "general"
      ? generalSchema
      : editMode === "role"
        ? roleSchema
        : passwordSchema;

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
      phoneNumber: user?.phoneNumber || "",
      whatsappNumber: user?.whatsappNumber || "",
      fullAddress: user?.fullAddress || "",
      role: user?.role || Role.CUSTOMER,
      password: "", // Always empty by default
    },
  });

  // Reset form when modal opens with new user data
  useEffect(() => {
    if (editMode) {
      form.reset({
        name: user.name || "",
        image: user.image || "",
        phoneNumber: user.phoneNumber || "",
        whatsappNumber: user.whatsappNumber || "",
        fullAddress: user.fullAddress || "",
        role: user.role || Role.CUSTOMER,
        password: "",
      });
      setFormError(null);
    }
  }, [editMode, user, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      if (editMode === "general") {
        const { error } = await authClient.admin.updateUser({
          userId: user.id,
          data: {
            name: values.name,
            image: values.image,
            // Assuming custom data fields are passed inside a nested object or directly
            // Adjust this structure if your better-auth config expects them at the root
            phoneNumber: values.phoneNumber,
            whatsappNumber: values.whatsappNumber,
            fullAddress: values.fullAddress,
          },
        });
        if (error) throw new Error(error.message);
      } else if (editMode === "role") {
        const { error } = await authClient.admin.setRole({
          userId: user.id,
          role: values.role,
        });
        if (error) throw new Error(error.message);
      } else if (editMode === "password") {
        const { error } = await authClient.admin.setUserPassword({
          userId: user.id,
          newPassword: values.password,
        });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      toast.add({
        title: "Success",
        description: `User ${editMode} updated successfully.`,
      });

      // Force refresh data
      await queryClient.resetQueries({ queryKey: ["admin-users"] });
      router.refresh();
      onClose();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const getTitle = () => {
    if (editMode === "general") return "Update General Info";
    if (editMode === "role") return "Change User Role";
    return "Set New Password";
  };

  return (
    <FormModal
      open={!!editMode}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={getTitle()}
      maxWidth={editMode === "general" ? "40rem" : "24rem"}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" form="update-user-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="update-user-form"
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-5"
      >
        {/* GENERAL INFO RENDER */}
        {editMode === "general" && (
          <>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="shrink-0">
                  <FieldLabel>Profile Photo</FieldLabel>
                  <SingleImageUploader
                    aspectRatio={1}
                    uploadPreset="avatar"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Full Name *</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                name="whatsappNumber"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>WhatsApp Number</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
            </div>
            <Controller
              name="fullAddress"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Full Address</FieldLabel>
                  <Textarea {...field} />
                </Field>
              )}
            />
          </>
        )}

        {/* ROLE RENDER */}
        {editMode === "role" && (
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>New Role *</FieldLabel>
                <NativeSelect {...field}>
                  <NativeSelectOption value={Role.CUSTOMER}>
                    CUSTOMER
                  </NativeSelectOption>
                  <NativeSelectOption value={Role.MODERATOR}>
                    MODERATOR
                  </NativeSelectOption>
                  <NativeSelectOption value={Role.ADMIN}>
                    ADMIN
                  </NativeSelectOption>
                </NativeSelect>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        )}

        {/* PASSWORD RENDER */}
        {editMode === "password" && (
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>New Password *</FieldLabel>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        )}

        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}
      </form>
    </FormModal>
  );
}
