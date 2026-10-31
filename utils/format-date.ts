// Fixed locale and time zone, so server and browser render the same text.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Dhaka",
});

export function formatDate(date: Date | string) {
  return dateFormat.format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return dateTimeFormat.format(new Date(date));
}
