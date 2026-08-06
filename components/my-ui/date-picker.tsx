"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            id="date"
            className={cn(
              // same anatomy as components/ui/input.tsx
              "flex h-9 w-full min-w-0 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
              "transition-[color,box-shadow]",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
          >
            <span className={cn(!selected && "text-muted-foreground")}>
              {selected ? new Date(selected).toLocaleDateString() : placeholder}
            </span>
            <CalendarIcon className="size-4 shrink-0 opacity-50" />
          </button>
        }
      />

      <PopoverContent
        className="w-auto p-0"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={selected ? new Date(selected) : undefined}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return;
            onSelect?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
