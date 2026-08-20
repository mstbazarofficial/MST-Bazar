"use client";

import { useEffect, useState, useTransition } from "react";

import {
  DeleteDialog,
  DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { toast } from "@/components/ui/toast"; // Adjust path to your toast import
import { ContactStatus, ContactSubmission } from "@/generated/prisma/browser";
import {
  Loader2,
  Mail,
  Phone,
  Save,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

interface ContactCardProps {
  contact: ContactSubmission;
  onUpdateStatus: (id: string, status: ContactStatus) => Promise<void>;
  onDelete: (id: string) => DeleteDialogActionType;
}

const statusBadgeVariants: Record<
  ContactStatus,
  "destructive" | "default" | "secondary" | "outline"
> = {
  PENDING: "destructive",
  IN_PROGRESS: "default",
  RESOLVED: "secondary",
  CLOSED: "outline",
};

export function ContactCard({
  contact,
  onUpdateStatus,
  onDelete,
}: ContactCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<ContactStatus>(
    contact.status,
  );
  const [savedStatus, setSavedStatus] = useState<ContactStatus>(contact.status);
  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    setSelectedStatus(contact.status);
    setSavedStatus(contact.status);
  }, [contact.status]);

  const isStatusChanged = selectedStatus !== savedStatus;

  const handleSave = () => {
    startTransition(async () => {
      try {
        await onUpdateStatus(contact.id, selectedStatus);
        setSavedStatus(selectedStatus);
        toast.add({
          type: "success",
          title: "Status updated",
          description: `Contact status changed to ${selectedStatus.replace("_", " ")}.`,
        });
      } catch (error) {
        toast.add({
          title: "Update failed",
          description:
            "There was an error updating the status. Please try again.",
          type: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    setSelectedStatus(savedStatus);
  };

  return (
    <Card className="w-full shadow-sm border py-0 gap-0 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center pt-5 justify-between space-y-0 pb-3 bg-muted/30">
        <div>
          <h3 className="font-semibold text-base leading-none">
            {contact.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(contact.createdAt).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </p>
        </div>
        <Badge variant={statusBadgeVariants[savedStatus]}>
          {savedStatus.replace("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="py-4 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 text-primary" />
          <a
            href={`mailto:${contact.email}`}
            className="text-foreground hover:underline truncate"
          >
            {contact.email}
          </a>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0 text-primary" />
          <a
            href={`tel:${contact.phone}`}
            className="text-foreground hover:underline"
          >
            {contact.phone}
          </a>
        </div>

        {contact.orderId && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="h-4 w-4 shrink-0 text-primary" />
            <span>
              Order ID:{" "}
              <strong className="text-foreground">{contact.orderId}</strong>
            </span>
          </div>
        )}

        <div className="mt-2 rounded-md bg-muted/40 p-3 text-sm text-foreground">
          <p className="whitespace-pre-wrap">{contact.message}</p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/10 py-4">
        <div className="flex items-center gap-2">
          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ContactStatus)}
            disabled={isSaving}
            className="w-36 h-9 text-xs"
          >
            <NativeSelectOption value="PENDING">PENDING</NativeSelectOption>
            <NativeSelectOption value="IN_PROGRESS">
              IN PROGRESS
            </NativeSelectOption>
            <NativeSelectOption value="RESOLVED">RESOLVED</NativeSelectOption>
            <NativeSelectOption value="CLOSED">CLOSED</NativeSelectOption>
          </NativeSelect>

          {isStatusChanged && (
            <>
              <Button
                size="icon"
                variant="default"
                className="h-9 w-9 shrink-0"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <DeleteDialog
          action={() => onDelete(contact.id)}
          title="Delete Contact Submission"
          description={`Are you sure you want to delete the message from ${contact.name}? This action cannot be undone.`}
          successMessage="Submission deleted successfully."
          errorMessage="Failed to delete submission."
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DeleteDialog>
      </CardFooter>
    </Card>
  );
}
