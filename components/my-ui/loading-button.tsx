import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import * as React from "react";

interface LoadingButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { className, children, loading = false, loadingText, disabled, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn("flex items-center justify-center gap-2", className)}
        {...props} // <-- This now safely includes `variant`, `size`, etc.
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{loading ? loadingText || children : children}</span>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
