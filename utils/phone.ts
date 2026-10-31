const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Turns Bangla digits, spaces and +880/880/00880 prefixes into 01XXXXXXXXX. */
export function normalizeBdPhone(phone: string) {
  const compact = phone
    .replace(/[০-৯]/g, (digit) => String(BANGLA_DIGITS.indexOf(digit)))
    .replace(/[\s()-]/g, "");

  return compact.match(/^(?:\+|00)?88(01\d{9})$/)?.[1] ?? compact;
}

/** Every format a Bangladeshi number may be stored in: 017..., +88017... or 88017.... */
export function getBdPhoneVariants(phone: string) {
  const normalized = normalizeBdPhone(phone);

  return /^01\d{9}$/.test(normalized)
    ? [normalized, `+88${normalized}`, `88${normalized}`]
    : [normalized];
}
