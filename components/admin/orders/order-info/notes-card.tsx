"use client";

import {
  DeleteDialog,
  DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/utils/format-date";
import { NotebookText, Trash2 } from "lucide-react";
import { AddNoteForm } from "../edit-order/add-note-form";

type Note = {
  id: string;
  content: string;
  createdAt: Date;
};

export function NotesCard({
  orderId,
  notes,
  onDelete,
}: {
  orderId: string;
  notes: Note[];
  onDelete: (id: string) => DeleteDialogActionType;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <NotebookText className="size-4" />
          Notes
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <AddNoteForm orderId={orderId} />

        <div className="divide-y divide-border border-t border-border">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start justify-between gap-3 py-3 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm wrap-break-word whitespace-pre-wrap text-foreground">
                  {note.content}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(note.createdAt)}
                </p>
              </div>

              <DeleteDialog
                title="Delete note?"
                description="This note will be permanently removed. This action cannot be undone."
                action={() => onDelete(note.id)}
                successMessage="Note deleted successfully."
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete note</span>
                </Button>
              </DeleteDialog>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="pt-4 text-center text-sm text-muted-foreground">
              No notes yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
