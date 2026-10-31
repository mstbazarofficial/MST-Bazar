type OrderItemInput = {
  price: number;
  quantity: number;
  discountPercentage?: number;
};

type OrderTotalInput = {
  orderItems: OrderItemInput[];
  discount: number;
  shippingCost: number;
};

/**
 * The price a customer pays for one unit, rounded to a whole taka.
 * Every total is built from this value, so the cart, checkout, emails and
 * admin always agree with the price shown on the product page.
 */
export function getUnitPrice(price: number, discountPercentage = 0) {
  return Math.round(price * (1 - discountPercentage / 100));
}

export function calculateOrderTotal(order: OrderTotalInput) {
  const itemsSubtotal = order.orderItems.reduce((sum, item) => {
    return sum + getUnitPrice(item.price, item.discountPercentage) * item.quantity;
  }, 0);

  const discountedSubtotal = itemsSubtotal - order.discount;
  const finalTotal = Math.max(0, discountedSubtotal + order.shippingCost);

  return {
    itemsSubtotal,
    discountAmount: order.discount,
    discountedSubtotal,
    finalTotal,
  };
}
