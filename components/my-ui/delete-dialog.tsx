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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
}: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

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
        }

        // Check if function returned explicitly false
        if (res === false) {
          toast.add({
            type: "error",
            description: errorMessage,
            priority: "high",
          });
          setOpen(false); // Dialog remains OPEN on failure
        }

        // --- SUCCESS PATH ---
        toast.add({ type: "success", description: successMessage });
        setOpen(false); // Close dialog on success
        router.refresh(); // Invalidate server components
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
            variant="destructive"
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
