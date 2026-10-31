import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimPromoCode,
  getUsablePromoCode,
  PromoCodeError,
} from "./promo-code";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const promo = {
  id: "promo-1",
  code: "EID10",
  discountType: "PERCENT",
  discountValue: 10,
  maxDiscount: null,
  minOrderAmount: 500,
  isActive: true,
  startsAt: null,
  endsAt: null,
  usageLimit: null as number | null,
  perCustomerLimit: null as number | null,
};

function fakeDb(found: Partial<typeof promo> | null, usedCount = 0) {
  return {
    promoCode: {
      findUnique: vi.fn(async () => (found ? { ...promo, ...found } : null)),
    },
    order: { count: vi.fn(async () => usedCount) },
    $queryRaw: vi.fn(async () => []),
  };
}

type Db = Parameters<typeof getUsablePromoCode>[0];

describe("getUsablePromoCode", () => {
  it("rejects an unknown code", async () => {
    const db = fakeDb(null) as unknown as Db;

    await expect(getUsablePromoCode(db, "NOPE", {})).rejects.toBeInstanceOf(
      PromoCodeError,
    );
  });

  it("rejects a code at its total limit", async () => {
    const db = fakeDb({ usageLimit: 3 }, 3) as unknown as Db;

    await expect(getUsablePromoCode(db, "EID10", {})).rejects.toThrow(
      "usage limit",
    );
  });

  it("does not count cancelled orders as uses", async () => {
    const db = fakeDb({});

    await getUsablePromoCode(db as unknown as Db, "EID10", {});

    expect(db.order.count).toHaveBeenCalledWith({
      where: { status: { not: "CANCELLED" }, promoCodeId: "promo-1" },
    });
  });

  it("matches a customer by every phone format and by account", async () => {
    const db = fakeDb({ perCustomerLimit: 1 });
    db.order.count.mockResolvedValueOnce(0).mockResolvedValueOnce(1);

    await expect(
      getUsablePromoCode(db as unknown as Db, "EID10", {
        phone: "01712345678",
        userId: "user-1",
      }),
    ).rejects.toThrow("already used");

    const where = (
      db.order.count.mock.calls as unknown as [
        { where: { OR: Record<string, { in: string[] } | string>[] } },
      ][]
    )[1][0].where;
    expect(where.OR[0].phoneNumber).toEqual({
      in: expect.arrayContaining(["01712345678"]),
    });
    expect(where.OR[1]).toEqual({ userId: "user-1" });
  });
});

describe("claimPromoCode", () => {
  beforeEach(() => vi.clearAllMocks());

  it("locks the code row before counting uses", async () => {
    const db = fakeDb({});

    await claimPromoCode(db as unknown as Db, "EID10", {}, 1000);

    expect(db.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      db.order.count.mock.invocationCallOrder[0],
    );
  });

  it("rejects an order below the minimum", async () => {
    const db = fakeDb({}) as unknown as Db;

    await expect(claimPromoCode(db, "EID10", {}, 499)).rejects.toThrow(
      "minimum order",
    );
  });

  it("returns the discount for the order", async () => {
    const db = fakeDb({}) as unknown as Db;

    await expect(claimPromoCode(db, "EID10", {}, 1009)).resolves.toEqual({
      id: "promo-1",
      code: "EID10",
      discount: 100,
    });
  });
});
