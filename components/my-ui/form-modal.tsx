"use client";

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string; // e.g. "32rem", "560px"
  disableOutsideClick?: boolean;
  disableEscapeKey?: boolean;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidth = "32rem",
  disableOutsideClick = false,
  disableEscapeKey = false,
}: FormModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) {
          if (disableOutsideClick && eventDetails.reason === "outside-press") {
            eventDetails.cancel();
            return;
          }
          if (disableEscapeKey && eventDetails.reason === "escape-key") {
            eventDetails.cancel();
            return;
          }
        }
        onOpenChange(nextOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
            "transition-opacity duration-200",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
          )}
        />
        <Dialog.Popup
          style={{ "--modal-max-w": maxWidth } as CSSProperties}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-background outline-none",
            "transition-all ease-out",

            // Mobile: full screen, top-aligned, slides up
            "inset-0 h-dvh w-full rounded-none duration-300",
            "data-starting-style:translate-y-full data-ending-style:translate-y-full",
            "data-ending-style:duration-200",

            // Desktop: centered card, fade + zoom, capped width/height
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[85vh]",
            "sm:w-[calc(100%-2rem)] sm:max-w-(--modal-max-w)",
            "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:border-border sm:shadow-lg",
            "sm:data-starting-style:translate-y-0 sm:data-ending-style:translate-y-0",
            "sm:data-starting-style:scale-95 sm:data-ending-style:scale-95",
            "sm:data-starting-style:opacity-0 sm:data-ending-style:opacity-0",
          )}
        >
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <Dialog.Title className="text-base font-semibold text-foreground sm:text-lg">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {children}
          </div>

          {/* Sticky footer (actions) */}
          {footer && (
            <div
              className="shrink-0 border-t border-border bg-background px-4 py-3 sm:px-6"
              style={{
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
              }}
            >
              {footer}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
