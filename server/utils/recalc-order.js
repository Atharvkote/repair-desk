export function recalcOrder(order) {
  if (!order) {
    throw new Error("Invalid order object");
  }

  if (!order.items) {
    order.items = [];
  }

  let itemsSubtotal = 0;
  let itemsDiscount = 0;

  for (const item of order.items) {
    if (!item.unitPrice || !item.quantity) {
      continue;
    }

    const subtotal = item.unitPrice * item.quantity;

    let discountAmount = 0;
    if (item.discount?.type === "PERCENT" && item.discount.value > 0) {
      discountAmount = Math.min((subtotal * item.discount.value) / 100, subtotal);
    } else if (item.discount?.type === "FLAT" && item.discount.value > 0) {
      discountAmount = Math.min(item.discount.value, subtotal);
    }

    const final = Math.max(0, subtotal - discountAmount);

    item.lineTotals = {
      subtotal,
      discount: discountAmount,
      final,
    };

    itemsSubtotal += subtotal;
    itemsDiscount += discountAmount;
  }

  const orderLevelDiscount =
    order.orderDiscount?.type === "FLAT" && order.orderDiscount.amount > 0
      ? order.orderDiscount.amount
      : 0;

  const payableAmount = itemsSubtotal - itemsDiscount;

  if (orderLevelDiscount > payableAmount) {
    throw new Error(
      `Order discount (${orderLevelDiscount}) exceeds payable amount (${payableAmount})`
    );
  }

  const final = Math.max(0, payableAmount - orderLevelDiscount);

  order.totals = {
    itemsSubtotal,
    itemsDiscount,
    orderDiscount: orderLevelDiscount,
    final,
  };
}
