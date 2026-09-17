"use client";

import { AuthBg } from "@/components/auth/auth-bg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setServerError(null);

    if (!token) {
      setServerError(
        "Invalid or missing reset token. Please request a new link.",
      );
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.newPassword,
        token,
      });

      if (error) {
        setServerError(
          error.message || "Failed to reset password. Link may be expired.",
        );
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-md py-8 sm:py-6 gap-1 border-0 sm:border border-border rounded-none sm:rounded-2xl shadow-none sm:shadow-xl bg-background sm:bg-card text-card-foreground backdrop-blur-sm my-auto flex flex-col justify-center px-2 sm:px-0">
      {/* Logo */}
      <div className="flex justify-center pt-2 pb-1">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Go to homepage"
        >
          <Image
            src="/assets/logo-vertical.png"
            alt="Logo"
            width={100}
            height={48}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>

      <CardHeader className="space-y-1 pb-4 px-6 sm:px-6">
        <CardTitle className="text-2xl font-bold flex items-center justify-center text-foreground">
          Reset Password
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center text-sm">
          {isSuccess
            ? "Your password has been reset successfully"
            : "Enter a new secure password for your account"}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-6">
        {isSuccess ? (
          <div className="space-y-6 text-center pt-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                All Set!
              </p>
              <p className="text-sm text-muted-foreground">
                You can now log in using your new password.
              </p>
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Global Error Banner */}
            {serverError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  className="pl-10 pr-10 border-input focus-visible:border-ring rounded-lg h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-primary" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                  className="pl-10 pr-10 border-input focus-visible:border-ring rounded-lg h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-primary" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPageClient() {
  return (
    <section className="h-screen w-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden bg-background relative flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
      <AuthBg />

      <section className="flex w-full min-h-full items-center justify-center lg:justify-start lg:pl-28 px-0 sm:px-4 py-0 sm:py-12 z-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </section>
  );
}
