// src/components/admin/delete-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as React from "react";

interface ActionResult {
  success: boolean;
  error?: string;
}

export type DeleteDialogActionType = Promise<ActionResult | boolean | void>;

interface DeleteDialogProps {
  children: React.ReactElement;
  /** Pass the server action or async delete function directly */
  action: () => DeleteDialogActionType;
  title: string;
  description: string;
  successMessage?: string;
  errorMessage?: string;
  confirmText?: string;
  loadingText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  /** Turn off when the action leaves the page, so it doesn't reload what it just deleted */
  refreshData?: boolean;
}

export function DeleteDialog({
  children,
  action,
  title,
  description,
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete item",
  confirmText = "Delete",
  loadingText = "Deleting...",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  refreshData = true,
}: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const queryClient = useQueryClient();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const res = await action();

        // Check if server action returned { success: false, error: "..." }
        if (
          typeof res === "object" &&
          res !== null &&
          "success" in res &&
          !res.success
        ) {
          toast.add({
            type: "error",
            description: res.error || errorMessage,
            priority: "high",
          });
          setOpen(false); // Dialog remains OPEN on failure
          return;
        }

        // Check if function returned explicitly false
        if (res === false) {
          toast.add({
            type: "error",
            description: errorMessage,
            priority: "high",
          });
          setOpen(false); // Dialog remains OPEN on failure
          return;
        }

        // --- SUCCESS PATH ---
        toast.add({ type: "success", description: successMessage });
        setOpen(false); // Close dialog on success
        if (refreshData) void queryClient.invalidateQueries();
      } catch (err) {
        toast.add({
          type: "error",
          description: err instanceof Error ? err.message : errorMessage,
          priority: "high",
        });
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? loadingText : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
