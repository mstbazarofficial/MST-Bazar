type OrderItemInput = {
  price: number;
  quantity: number;
  discountPercentage: number;
};

type OrderTotalInput = {
  orderItems: OrderItemInput[];
  discount: number;
  shippingCost: number;
};

export function calculateOrderTotal(order: OrderTotalInput) {
  const itemsSubtotal = order.orderItems.reduce((sum, item) => {
    const itemPrice = item.price * (1 - item.discountPercentage / 100);
    return sum + itemPrice * item.quantity;
  }, 0);

  const discountedSubtotal = itemsSubtotal - order.discount;
  const finalTotal = discountedSubtotal + order.shippingCost;

  return {
    itemsSubtotal,
    discountAmount: order.discount,
    discountedSubtotal,
    finalTotal,
  };
}
