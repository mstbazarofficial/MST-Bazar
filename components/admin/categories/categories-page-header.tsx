// src/components/admin/categories/categories-page-header.tsx
"use client";

import { PageHeader } from "@/components/admin/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CategoriesPageHeader() {
  return (
    <PageHeader
      title="Categories"
      actions={
        <Link
          href="/admin/categories/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="size-4" />
          Add category
        </Link>
      }
    />
  );
}
