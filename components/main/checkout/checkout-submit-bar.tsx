"use client";

import {
  Headphones,
  Leaf,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

interface CheckoutSubmitBarProps {
  isSubmitting: boolean;
}

export function CheckoutSubmitBar({ isSubmitting }: CheckoutSubmitBarProps) {
  return (
    <div className="bg-primary/5 border border-primary/60 rounded-md p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-foreground">
            Almost there!
          </h4>
          <p className="text-xs text-muted-foreground lg:w-full max-w-80 font-medium">
            Please review your order and click the button below to place your
            order.
          </p>
        </div>
      </div>

      {/* Mobile sticky submit */}
      <div className="w-full sm:hidden flex items-center bg-background justify-center bottom-0 left-0 right-0 z-50 max-sm:fixed px-5 py-2 border-t border-border/60">
        <SubmitButton isSubmitting={isSubmitting} />
      </div>

      {/* Desktop submit */}
      <div className="w-full hidden md:w-auto text-center md:text-right space-y-1 sm:flex flex-col items-center justify-center gap-2">
        <SubmitButton isSubmitting={isSubmitting} />
        <p className="text-[10px] text-center text-muted-foreground font-medium">
          You won&apos;t be charged until the order is confirmed
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full md:w-auto bg-primary-dark hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm px-8 py-3 rounded-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Placing Order...</span>
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          <span>Place Order</span>
        </>
      )}
    </button>
  );
}

export function CheckoutTrustBadges() {
  const BADGES = [
    { icon: Leaf, title: "100% Natural", desc: "Pure & authentic products" },
    { icon: Truck, title: "Fast Delivery", desc: "Quick & reliable delivery" },
    {
      icon: RotateCcw,
      title: "Cash on Delivery",
      desc: "Pay when you receive",
    },
    { icon: Headphones, title: "Happy Customer", desc: "10K+ happy customers" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-primary/60 justify-items-center">
      {BADGES.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.title} className="flex items-center gap-2.5">
            <div className="text-primary shrink-0">
              <Icon className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground leading-tight">
                {b.title}
              </h5>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                {b.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
