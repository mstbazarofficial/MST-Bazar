"use client";

import { ArrowRight, Headset } from "lucide-react";
import { useRouter } from "next/navigation";

export function SupportCard() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 bg-accent/60 border border-border rounded-lg p-5">
      <div className="w-11.5 h-11.5 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
        <Headset size={22} />
      </div>

      <div className="flex-1">
        <h4 className="text-[0.9375rem] font-bold text-foreground mb-0.5">
          Need Help?
        </h4>
        <p className="text-[0.85rem] text-muted-foreground">
          Questions about your order? Our support team is happy to assist.
        </p>
      </div>

      <button
        type="button"
        className="flex items-center gap-1.5 h-10 px-4.5 border border-primary rounded-md bg-transparent text-primary text-sm font-bold hover:bg-accent transition-colors whitespace-nowrap shrink-0"
        onClick={() => router.push("/contact")}
      >
        Contact Support
        <ArrowRight size={15} className="shrink-0" />
      </button>
    </div>
  );
}
