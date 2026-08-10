import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import HeadingStyle2 from "../common/HeadingStyle2";

export function ContactFormSection() {
  return (
    <div className="flex flex-col space-y-6 h-full">
      <div>
        <HeadingStyle2
          firstTitle="Send Us a"
          secondTitle="Message"
          className="mb-5"
        />
        <p className="text-gray-600 text-sm">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form className="flex-1 flex flex-col justify-between">
        <FieldSet className="">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <Field className="w-full">
              <FieldLabel className="text-sm font-semibold text-gray-700">
                Your Name <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                type="text"
                placeholder="Enter your full name"
                className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
              />
            </Field>

            {/* Email Field */}
            <Field className="w-full">
              <FieldLabel className="text-sm font-semibold text-gray-700">
                Your Email <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
              />
            </Field>
          </FieldGroup>

          {/* Subject Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Subject <span className="text-red-500">*</span>
            </FieldLabel>

            <Input
              type="text"
              placeholder="How can we help you?"
              className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
            />
          </Field>

          {/* Order ID Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Order ID (Optional)
            </FieldLabel>

            <Input
              type="text"
              placeholder="Enter your order ID (e.g. MST123456)"
              className="h-10 rounded-md border-gray-200 focus-visible:ring-primary/45"
            />
          </Field>

          {/* Message Field */}
          <Field className="w-full">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Message <span className="text-red-500">*</span>
            </FieldLabel>

            <Textarea
              placeholder="Type your message here..."
              className="min-h-30 rounded-lg border-gray-200 focus-visible:ring-primary/45 resize-none"
            />
          </Field>
        </FieldSet>

        {/* Submit Button */}
        <Button className="w-full h-12 mt-6 bg-primary-dark hover:bg-primary hover:text-white rounded-md font-bold text-base">
          <Send className="w-4 h-4 mr-2" /> Send Message
        </Button>
      </form>
    </div>
  );
}
