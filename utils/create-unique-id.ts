import { customAlphabet } from "nanoid";

// Use uppercase letters & numbers, avoid similar-looking chars like O/0, I/1
const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

/**
 * Generate a stylish unique Order ID
 * Format: PREFIX-YYMMDD-XXXXXX
 * Example: ORD-250808-Q7G9K2
 */
export function createUniqueId(prefix = "ORD") {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(2, 10) // YY-MM-DD
    .replace(/-/g, ""); // → YYMMDD
  const randomPart = nanoid(); // → XXXXXX

  return `${prefix}-${datePart}-${randomPart}`;
}
