"use client";

import { EmptyState } from "@/components/admin/layout/empty-state";
import { Button } from "@/components/ui/button";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";

export default function AdminError({ reset }: { reset: () => void }) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  return (
    <main className="flex flex-1 flex-col items-center gap-4 p-6">
      <EmptyState
        icon={CircleAlert}
        title="This page couldn't be loaded."
        className="w-full rounded-lg border bg-card"
      />
      <Button
        onClick={() => {
          resetQueries();
          reset();
        }}
      >
        Try again
      </Button>
    </main>
  );
}
