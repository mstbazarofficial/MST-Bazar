"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  PageHeading,
  Panel,
} from "@/components/dashboard/layout/dashboard-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

// ── Schemas ──────────────────────────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function PasswordInput({
  id,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {!show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

// ── Change Password Card ──────────────────────────────────────────────────────

function ChangePasswordCard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordValues) {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message ?? "Failed to change password.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Success",
      description: "Password changed. All other sessions have been signed out.",
    });
    reset();
  }

  return (
    <Panel
      title="Change password"
      description="Other devices are signed out after you change it."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border-t border-border px-5 py-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword" className="text-sm font-medium">
            Current password
          </Label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            {...register("currentPassword")}
          />
          <FieldError message={errors.currentPassword?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New password
          </Label>
          <PasswordInput
            id="newPassword"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm new password
          </Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Panel>
  );
}

// ── Forgot Password Card ──────────────────────────────────────────────────────

function ForgotPasswordCard({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);

    if (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message ?? "Failed to send reset email.",
      });
      return;
    }

    setSent(true);
  }

  return (
    <Panel
      title="Forgot your password?"
      description={
        sent
          ? `Reset link sent to ${email}. Check your spam folder if you don't see it.`
          : `We'll send a reset link to ${email}.`
      }
      action={
        <Button
          onClick={handleReset}
          disabled={loading}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {sent ? "Send again" : "Send link"}
        </Button>
      }
    />
  );
}

// ── Exported Section ──────────────────────────────────────────────────────────

interface SecuritySectionProps {
  email: string;
}

export function SecuritySection({ email }: SecuritySectionProps) {
  return (
    <div className="space-y-5">
      <PageHeading
        title="Security"
        description="Manage your password and account access."
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ChangePasswordCard />
        <ForgotPasswordCard email={email} />
      </div>
    </div>
  );
}
