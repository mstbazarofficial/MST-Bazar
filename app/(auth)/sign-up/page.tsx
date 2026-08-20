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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);

    try {
      const { error: authError } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phone || undefined,
        callbackURL: "/",
      });

      if (authError) {
        setServerError(
          authError.message || "Failed to create account. Please try again.",
        );
      } else {
        setSubmittedEmail(values.email);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <section className="h-screen w-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden bg-background relative flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
      <AuthBg />

      <section className="flex w-full min-h-full items-center justify-center lg:justify-start lg:pl-28 px-0 sm:px-4 py-0 sm:py-12 z-10">
        <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-md py-8 sm:py-6 gap-1 border-0 sm:border border-border rounded-none sm:rounded-2xl shadow-none sm:shadow-xl bg-background sm:bg-card text-card-foreground backdrop-blur-sm my-auto flex flex-col justify-center px-2 sm:px-0">
          {/* Logo */}
          <div className="flex justify-center pt-2 pb-1">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Go to homepage"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={48}
                height={48}
                priority
                className=" w-auto"
              />
            </Link>
          </div>

          {isSubmitted ? (
            /* Email Verification Screen */
            <CardContent className="space-y-6 pt-4 text-center px-6 sm:px-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                  <MailCheck className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Check Your Email
                </h3>
                <p className="text-sm text-muted-foreground">
                  We sent an activation link to{" "}
                  <span className="font-semibold text-foreground">
                    {submittedEmail}
                  </span>
                  .
                </p>
              </div>

              <div className="p-4 bg-muted border border-border rounded-xl text-xs text-muted-foreground text-left space-y-1">
                <p className="font-semibold text-foreground">
                  ⚡ Didn't get the email?
                </p>
                <p>
                  Please check your <strong>Spam</strong> or{" "}
                  <strong>Junk</strong> folder. Activation emails can sometimes
                  be filtered automatically.
                </p>
              </div>

              <Link href="/login" className="block w-full">
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            /* Registration Form View */
            <>
              <CardHeader className="space-y-1 pb-4 px-6 sm:px-6">
                <CardTitle className="text-2xl font-bold flex items-center justify-center text-foreground">
                  Welcome to MST Bazar
                </CardTitle>
                <CardDescription className="text-muted-foreground text-center text-sm">
                  Create your account and start your healthy shopping journey
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 sm:px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Global Server Error Banner */}
                  {serverError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        {...register("name")}
                        className="pl-10 border-input focus-visible:border-ring rounded-lg h-11"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        {...register("email")}
                        className="pl-10 border-input focus-visible:border-ring rounded-lg h-11"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register("phone")}
                        className="pl-10 border-input focus-visible:border-ring rounded-lg h-11"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        {...register("password")}
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
                    {errors.password && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        className="pl-10 pr-10 border-input focus-visible:border-ring rounded-lg h-11"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

                  {/* Terms & Conditions Checkbox */}
                  <div className="flex items-start space-x-2 pt-1">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setAgreeTerms(checked === true)
                      }
                      className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-xs leading-snug text-muted-foreground font-normal cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary font-semibold hover:underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-primary font-semibold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!agreeTerms || isSubmitting}
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-11 text-base font-semibold group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  {/* Footer Link */}
                  <div className="text-center text-sm text-muted-foreground pt-1">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary font-semibold hover:underline"
                    >
                      Login Now
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </section>
    </section>
  );
}
