"use client";

import { Hash, Loader2, Phone, Search } from "lucide-react";
import { useState } from "react";

interface OrderSearchFormProps {
  onSearch: (orderId: string, phone: string) => void;
  isPending: boolean;
}

export function OrderSearchForm({ onSearch, isPending }: OrderSearchFormProps) {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(orderId, phone);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        {/* Order ID */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            className="text-[13px] font-semibold text-foreground"
            htmlFor="orderId"
          >
            Order ID
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="orderId"
              type="text"
              placeholder="e.g. ORD-20240001"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full h-11.5 pl-9 pr-3 border border-input rounded-md text-[15px] text-foreground bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:opacity-70 transition-all box-border placeholder:text-muted-foreground"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            className="text-[13px] font-semibold text-foreground"
            htmlFor="phone"
          >
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 01700000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11.5 pl-9 pr-3 border border-input rounded-md text-[15px] text-foreground bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:opacity-70 transition-all box-border placeholder:text-muted-foreground"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="h-11.5 px-6 bg-primary hover:bg-primary-dark disabled:opacity-65 disabled:cursor-not-allowed text-primary-foreground text-[15px] font-bold rounded-md flex items-center justify-center gap-2 whitespace-nowrap transition-colors shrink-0"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Track Order
            </>
          )}
        </button>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Your information is kept private and secure
      </p>
    </form>
  );
}
