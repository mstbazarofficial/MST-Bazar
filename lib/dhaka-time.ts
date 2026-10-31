// Bangladesh has no daylight saving, so the offset is fixed at UTC+6.
const DHAKA_UTC_OFFSET_MS = 6 * 60 * 60 * 1000;

/** The current Dhaka wall-clock time, read through the Date's UTC getters. */
export function getDhakaNow() {
  return new Date(Date.now() + DHAKA_UTC_OFFSET_MS);
}

/** Converts "YYYY-MM" into the exact instants that month starts and ends in Dhaka. */
export function getDhakaMonthRange(month?: string) {
  const match = month?.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthNumber = Number(match[2]);

  return {
    gte: new Date(Date.UTC(year, monthNumber - 1, 1) - DHAKA_UTC_OFFSET_MS),
    lt: new Date(Date.UTC(year, monthNumber, 1) - DHAKA_UTC_OFFSET_MS),
  };
}

/** Converts "YYYY-MM-DD" into the exact instants that day starts and ends in Dhaka. */
export function getDhakaDayRange(day: string) {
  const start = Date.parse(`${day}T00:00:00Z`) - DHAKA_UTC_OFFSET_MS;

  return {
    gte: new Date(start),
    lt: new Date(start + 24 * 60 * 60 * 1000),
  };
}

/** The Dhaka calendar day of an instant as "YYYY-MM-DD", for date inputs. */
export function toDhakaDay(date: Date) {
  return new Date(date.getTime() + DHAKA_UTC_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

/** The last `count` Dhaka days as "YYYY-MM-DD", oldest first, ending today. */
export function getRecentDhakaDays(count: number) {
  const today = Date.parse(toDhakaDay(new Date()));

  return Array.from({ length: count }, (_, i) =>
    new Date(today - (count - 1 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  );
}

/** Recent months for filter dropdowns, e.g. { value: "2026-06", label: "June 2026" }. */
export function getDhakaMonthOptions(monthsToGenerate = 12) {
  const now = getDhakaNow();

  return Array.from({ length: monthsToGenerate }, (_, i) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );

    return {
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    };
  });
}
