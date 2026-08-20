"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
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
import { Role } from "@/generated/prisma/browser";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/utils/get-error-message";
import { useRouter } from "next/navigation";

// ==========================================
// SCHEMA
// ==========================================
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Role, { message: "Please select a valid role" }),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  fullAddress: z.string().optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

// ==========================================
// PROPS
// ==========================================
interface CreateUserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserFormModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserFormModalProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  // ==========================================
  // FORM SETUP
  // ==========================================
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.CUSTOMER,
      image: "",
      phoneNumber: "",
      whatsappNumber: "",
      fullAddress: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  // ==========================================
  // MUTATION
  // ==========================================
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateUserInput) => {
      const { data, error } = await authClient.admin.createUser({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        data: {
          image: values.image || undefined,
          phoneNumber: values.phoneNumber || undefined,
          whatsappNumber: values.whatsappNumber || undefined,
          fullAddress: values.fullAddress || undefined,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create user");
      }

      return data;
    },
    onSuccess: () => {
      setFormError(null);
      toast.add({
        title: "User Created",
        description: "New user account has been successfully created.",
      });
      reset();
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: CreateUserInput) => {
    setFormError(null);
    mutate(values);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleClose}
      title="Create New User"
      description="Add a new user to the system directly from the admin panel."
      maxWidth="40rem"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-user-form" disabled={isPending}>
            {isPending ? "Creating..." : "Create User"}
          </Button>
        </div>
      }
    >
      <form
        id="create-user-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Profile Image */}
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="shrink-0">
              <FieldLabel>Profile Photo</FieldLabel>
              <SingleImageUploader
                aspectRatio={1}
                uploadPreset="avatar"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                error={fieldState.error?.message}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Basic Info (Name & Role) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name *</FieldLabel>
                <Input placeholder="e.g. John Doe" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Role *</FieldLabel>
                <NativeSelect {...field} className="h-9 text-sm">
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
        </div>

        {/* Credentials (Email & Password) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email Address *</FieldLabel>
                <Input type="email" placeholder="user@example.com" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Password *</FieldLabel>
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
        </div>

        <div className="border-t border-border" />

        {/* Contact Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input placeholder="+880 1700 000000" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="whatsappNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>WhatsApp Number</FieldLabel>
                <Input placeholder="+880 1700 000000" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Address */}
        <Controller
          name="fullAddress"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Full Address</FieldLabel>
              <Textarea placeholder="House, Road, Area, City" {...field} />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {/* Form-level error */}
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
