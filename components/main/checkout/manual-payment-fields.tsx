"use client";

import { toast } from "@/components/ui/toast";
import { Check, Copy, Info, Receipt, Smartphone } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/constants/site";
import type { CheckoutFormValues } from "@/validation/checkout.validation";

export function ManualPaymentFields() {
  const BKASH_NUMBER = SITE_CONFIG.bkash;
  const NAGAD_NUMBER = SITE_CONFIG.nagad;
  const METHOD_CONFIG: Record<
    string,
    {
      name: string;
      number: string;
      type: string;
      badgeColor: string;
      instructions: string[];
    }
  > = {
    bkash: {
      name: "bKash",
      number: `${BKASH_NUMBER}`,
      type: "Personal (Send Money)",
      badgeColor: "bg-pink-100 text-pink-600 border-pink-200",
      instructions: [
        "Open the bKash app or dial *247#.",
        "Select 'Send Money'.",
        "Send the exact amount to the number below.",
        "Copy the Transaction ID (TrxID) from the confirmation.",
        "Enter your number and the TrxID in the form below.",
      ],
    },
    nagad: {
      name: "Nagad",
      number: `${NAGAD_NUMBER}`,
      type: "Personal (Send Money)",
      badgeColor: "bg-orange-100 text-orange-600 border-orange-200",
      instructions: [
        "Open the Nagad app or dial *167#.",
        "Select 'Send Money'.",
        "Send the exact amount to the number below.",
        "Copy the Transaction ID from the confirmation.",
        "Enter your sender number and TrxID below.",
      ],
    },
  };
  const { control } = useFormContext<CheckoutFormValues>();
  const selectedMethod = useWatch({ control, name: "paymentMethod" });
  const [copied, setCopied] = useState(false);

  if (selectedMethod === "cod") return null;

  const config = METHOD_CONFIG[selectedMethod];

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(config.number);
      setCopied(true);
      toast.add({
        title: `${config.name} number copied to clipboard`,
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Couldn't copy the number. Please copy it manually.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-card border border-primary/60 rounded-md p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
          <Receipt className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
          <span>{config.name} Payment Instructions</span>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.badgeColor}`}
        >
          {config.type}
        </span>
      </div>
      {config.number === "" ? (
        <div className="bg-red-100 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-sm">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.badgeColor}`}
          >
            {config.name}
          </span>
          number is not available. Please choose another payment method.
        </div>
      ) : (
        <>
          <div className="bg-primary/5 border border-primary/70 rounded-sm p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Send Money To This {config.name} Number
              </p>
              <p className="text-base font-black text-emerald-800 tracking-wide">
                {config.number}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyNumber}
              className="flex items-center gap-1.5 bg-white border border-primary/70 text-primary-dark hover:bg-emerald-100 text-xs font-bold px-3 py-1.5 rounded-sm transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              <span>How to pay:</span>
            </div>
            <ol className="space-y-1 pl-4 list-decimal text-[11px] text-muted-foreground font-medium">
              {config.instructions.map((step) => (
                <li key={step} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 gap-y-3.5">
            <Controller
              name="paymentPhone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Your {config.name} Number</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    inputMode="numeric"
                    placeholder="017XXXXXXXX"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="transactionId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Transaction ID (TrxID)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    id={field.name}
                    placeholder="e.g. 9J7A6X8Y2Z"
                    className="uppercase"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </>
      )}
    </div>
  );
}
