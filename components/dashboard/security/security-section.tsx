"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        className="pr-10 rounded-xl"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
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
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <LockKeyhole className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Change Password</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose a strong password you haven't used before.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword" className="text-xs font-semibold">
            Current Password
          </Label>
          <PasswordInput
            id="currentPassword"
            placeholder="Enter your current password"
            {...register("currentPassword")}
          />
          <FieldError message={errors.currentPassword?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-xs font-semibold">
            New Password
          </Label>
          <PasswordInput
            id="newPassword"
            placeholder="At least 8 characters"
            {...register("newPassword")}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold">
            Confirm New Password
          </Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Repeat your new password"
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating…
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4 mr-2" />
              Update Password
            </>
          )}
        </Button>
      </form>
    </div>
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
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <RotateCcw className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Forgot Password?
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            We'll send a reset link to your email address.
          </p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Email display */}
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-muted/50 border border-border/60">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            {email}
          </span>
        </div>

        {sent ? (
          /* Success state */
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">
                Reset link sent!
              </p>
            </div>
            <p className="text-xs text-emerald-600 leading-relaxed pl-6">
              Check your inbox at <span className="font-semibold">{email}</span>
              . If you don't see it within a few minutes, check your{" "}
              <span className="font-semibold">spam or junk folder</span>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-[11px] text-emerald-600 underline underline-offset-2 pl-6 mt-1 hover:text-emerald-700 transition-colors"
            >
              Didn't receive it? Send again
            </button>
          </div>
        ) : (
          <Button
            onClick={handleReset}
            disabled={loading}
            variant="outline"
            className="w-full rounded-xl font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Reset Link
              </>
            )}
          </Button>
        )}

        {!sent && (
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            The link will arrive at{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Check your spam folder if it doesn't appear shortly.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Exported Section ──────────────────────────────────────────────────────────

interface SecuritySectionProps {
  email: string;
}

export function SecuritySection({ email }: SecuritySectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Security</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your password and account access.
        </p>
      </div>

      <ChangePasswordCard />
      <ForgotPasswordCard email={email} />
    </div>
  );
}
