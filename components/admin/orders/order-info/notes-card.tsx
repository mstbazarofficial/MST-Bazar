"use client";

import {
  DeleteDialog,
  DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookText, Plus, Trash2 } from "lucide-react";

type Note = {
  id: string;
  content: string;
  createdAt: Date;
};

export function NotesCard({
  notes,
  onAdd,
  onDelete,
}: {
  notes: Note[];
  onAdd: () => void;
  onDelete: (id: string) => DeleteDialogActionType;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <NotebookText className="size-4" />
            Notes
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="size-3.5" />
            Add Note
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
          >
            <div>
              <p className="text-sm text-foreground">{note.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {note.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
                className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">Delete note</span>
              </Button>
            </DeleteDialog>
          </div>
        ))}

        {notes.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No notes yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
