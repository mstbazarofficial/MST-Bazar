"use client";

import { CategoryFormPage } from "@/components/admin/categories/category-form-page";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import EditCategoryLoading from "./loading";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();

  const { data: category } = useQuery({
    queryKey: ["admin-category", id],
    queryFn: () => adminFetch("category", { id }),
    staleTime: 0,
    gcTime: 0,
  });

  if (category === undefined) return <EditCategoryLoading />;
  if (category === null) notFound();

  return (
    <CategoryFormPage
      mode="edit"
      categoryId={category.id}
      initialValues={{
        name: category.name,
        inputSlug: category.slug,
        image: category.image ?? "",
        priority: category.priority,
      }}
    />
  );
}
