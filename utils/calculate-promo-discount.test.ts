import { describe, expect, it } from "vitest";
import {
  calculatePromoDiscount,
  getPromoStatus,
  type PromoRules,
} from "./calculate-promo-discount";

const percent: PromoRules = {
  discountType: "PERCENT",
  discountValue: 10,
  maxDiscount: null,
  minOrderAmount: 0,
};

const fixed: PromoRules = { ...percent, discountType: "FIXED", discountValue: 150 };

describe("calculatePromoDiscount", () => {
  it("takes a percent of the items", () => {
    expect(calculatePromoDiscount(percent, 1000)).toBe(100);
  });

  it("rounds down to a whole taka", () => {
    expect(calculatePromoDiscount(percent, 1009)).toBe(100);
  });

  it("stops at the maximum discount", () => {
    expect(
      calculatePromoDiscount({ ...percent, maxDiscount: 50 }, 1000),
    ).toBe(50);
  });

  it("gives nothing below the minimum order", () => {
    expect(
      calculatePromoDiscount({ ...percent, minOrderAmount: 500 }, 499),
    ).toBe(0);
    expect(
      calculatePromoDiscount({ ...percent, minOrderAmount: 500 }, 500),
    ).toBe(50);
  });

  it("takes a fixed amount", () => {
    expect(calculatePromoDiscount(fixed, 1000)).toBe(150);
  });

  it("never takes more than the items cost", () => {
    expect(calculatePromoDiscount(fixed, 100)).toBe(100);
  });
});

describe("getPromoStatus", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  const before = new Date("2026-06-01T00:00:00Z");
  const after = new Date("2026-07-01T00:00:00Z");
  const open = {
    isActive: true,
    startsAt: null,
    endsAt: null,
    usageLimit: null,
  };

  it("is active with no limits", () => {
    expect(getPromoStatus(open, 1000, now)).toBe("ACTIVE");
  });

  it("is paused when turned off, even if also expired", () => {
    expect(
      getPromoStatus({ ...open, isActive: false, endsAt: before }, 0, now),
    ).toBe("PAUSED");
  });

  it("is scheduled before the start date", () => {
    expect(getPromoStatus({ ...open, startsAt: after }, 0, now)).toBe(
      "SCHEDULED",
    );
  });

  it("starts exactly at the start date and ends exactly at the end date", () => {
    expect(getPromoStatus({ ...open, startsAt: now }, 0, now)).toBe("ACTIVE");
    expect(getPromoStatus({ ...open, endsAt: now }, 0, now)).toBe("EXPIRED");
  });

  it("is used up at the total limit, not before", () => {
    expect(getPromoStatus({ ...open, usageLimit: 5 }, 4, now)).toBe("ACTIVE");
    expect(getPromoStatus({ ...open, usageLimit: 5 }, 5, now)).toBe("USED_UP");
  });
});
