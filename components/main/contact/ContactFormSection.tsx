"use client";

import { submitContactForm } from "@/actions/main/contact";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/validation/contact.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SectionHeading } from "../common/layout/section-heading";

export function ContactFormSection() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      orderId: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setGlobalError(null);
    setSuccessMessage(null);

    const result = await submitContactForm(data);

    if (result.success) {
      setSuccessMessage("Thank you! Your message has been sent successfully.");
      reset();
    } else {
      setGlobalError(result.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <div>
        <SectionHeading title="Send us a message" highlightPositions={[4]} />
        <p className="text-gray-600 text-sm">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col justify-between"
      >
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <Field className="w-full">
              <FieldLabel className="text-sm font-semibold text-gray-700">
                Your Name <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                {...register("name")}
                type="text"
                placeholder="Enter your full name"
                className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.name.message}
                </p>
              )}
            </Field>

            {/* Email Field */}
            <Field className="w-full">
              <FieldLabel className="text-sm font-semibold text-gray-700">
                Your Email <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email address"
                className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          {/* Phone Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </FieldLabel>

            <Input
              {...register("phone")}
              type="tel"
              placeholder="Enter your phone number"
              className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.phone.message}
              </p>
            )}
          </Field>

          {/* Order ID Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Order ID (Optional)
            </FieldLabel>

            <Input
              {...register("orderId")}
              type="text"
              placeholder="Enter your order ID (e.g. MST123456)"
              className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
            />
            {errors.orderId && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.orderId.message}
              </p>
            )}
          </Field>

          {/* Message Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Message <span className="text-red-500">*</span>
            </FieldLabel>

            <Textarea
              {...register("message")}
              placeholder="Type your message here..."
              className="min-h-30 rounded-lg border-gray-200 focus-visible:ring-primary/45 resize-none"
            />
            {errors.message && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.message.message}
              </p>
            )}
          </Field>
          {/* Global Error Banner */}
          {globalError && (
            <div className="p-3.5  rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              {globalError}
            </div>
          )}

          {/* Global Success Banner */}
          {successMessage && (
            <div className="p-3.5  rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              {successMessage}
            </div>
          )}
        </FieldSet>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-6 bg-primary-dark hover:bg-primary hover:text-white rounded-md font-bold text-base"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
