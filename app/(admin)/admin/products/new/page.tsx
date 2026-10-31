"use client";

import { ProductFormPage } from "@/components/admin/products/product-form-page";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import NewProductLoading from "./loading";

export default function NewProductPage() {
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminFetch("categories"),
  });

  if (!categories) return <NewProductLoading />;

  return <ProductFormPage categories={categories} />;
}
