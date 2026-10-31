import { describe, expect, it } from "vitest";
import { calculateOrderTotal, getUnitPrice } from "./calculate-order-total";

describe("getUnitPrice", () => {
  it("keeps the price when there is no discount", () => {
    expect(getUnitPrice(500)).toBe(500);
  });

  it("rounds to the nearest whole taka per unit", () => {
    expect(getUnitPrice(333, 15)).toBe(283);
    expect(getUnitPrice(199, 12.5)).toBe(174);
  });

  it("rounds a price with paisa even with no discount", () => {
    expect(getUnitPrice(99.5)).toBe(100);
  });
});

describe("calculateOrderTotal", () => {
  it("rounds each unit before multiplying by quantity", () => {
    const { itemsSubtotal } = calculateOrderTotal({
      orderItems: [{ price: 333, discountPercentage: 15, quantity: 3 }],
      discount: 0,
      shippingCost: 0,
    });

    expect(itemsSubtotal).toBe(849);
  });

  it("takes the promo off the items and adds delivery after", () => {
    expect(
      calculateOrderTotal({
        orderItems: [
          { price: 500, quantity: 2 },
          { price: 200, discountPercentage: 10, quantity: 1 },
        ],
        discount: 100,
        shippingCost: 60,
      }),
    ).toEqual({
      itemsSubtotal: 1180,
      discountAmount: 100,
      discountedSubtotal: 1080,
      finalTotal: 1140,
    });
  });

  it("never returns a negative total", () => {
    const { finalTotal } = calculateOrderTotal({
      orderItems: [{ price: 100, quantity: 1 }],
      discount: 500,
      shippingCost: 60,
    });

    expect(finalTotal).toBe(0);
  });
});
