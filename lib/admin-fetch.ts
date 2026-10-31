import type { AdminReaders } from "@/lib/admin-readers";

type Params = Record<string, string | number | null | undefined>;

// Exact output of Date#toJSON, so ordinary text and date-only values stay strings.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function reviveDates(_key: string, value: unknown) {
  return typeof value === "string" && ISO_DATE.test(value)
    ? new Date(value)
    : value;
}

export async function adminFetch<K extends keyof AdminReaders>(
  resource: K,
  params: Params = {},
): Promise<Awaited<ReturnType<AdminReaders[K]>>> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, String(value));
  });

  const response = await fetch(`/api/admin/${resource}?${search}`);

  // requireRole redirects when the session ended or the role doesn't allow this.
  if (response.redirected) {
    window.location.assign(response.url);
    return new Promise<never>(() => {});
  }

  if (!response.ok) throw new Error(`Failed to load ${resource}`);

  return JSON.parse(await response.text(), reviveDates);
}
