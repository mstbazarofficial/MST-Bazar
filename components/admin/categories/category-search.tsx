"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CategorySearch({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultValue);
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

  // Sync state during render if prop changes (e.g., browser back/forward or navigation)
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setValue(defaultValue);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm">
      <Input
        name="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search categories..."
      />
    </form>
  );
}
