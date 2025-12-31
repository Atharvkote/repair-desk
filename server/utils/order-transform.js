export const transformOrderForFrontend = (order) => {
  if (!order) return null;

  const orderObj = order.toObject ? order.toObject() : order;

  const items = (orderObj.items || []).map((item) => {
    const itemId =
      item.itemType === "SERVICE"
        ? item.serviceId?._id || item.serviceId
        : item.partId?._id || item.partId;

    return {
      itemId: itemId?.toString() || "",
      quantity: item.quantity || 1,
      type: item.itemType === "SERVICE" ? "service" : "part",
      name: item.name,
      price: item.unitPrice,
      discount: item.discount || { type: "PERCENT", value: 0 },
      lineTotals: item.lineTotals || {},
    };
  });

  const discounts = {};
  orderObj.items.forEach((originalItem) => {
    if (originalItem && originalItem.discount?.value > 0) {
      const itemId =
        originalItem.itemType === "SERVICE"
          ? originalItem.serviceId?._id || originalItem.serviceId
          : originalItem.partId?._id || originalItem.partId;
      if (itemId) {
        const itemIdStr = itemId.toString();
        if (originalItem.discount.type === "PERCENT") {
          discounts[itemIdStr] = originalItem.discount.value;
        }
      }
    }
  });

  const statusMap = {
    DRAFT: "draft",
    ONGOING: "started",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  return {
    id: orderObj._id?.toString() || orderObj.id,
    customerId: orderObj.customerId?._id?.toString() || orderObj.customerId?.toString() || orderObj.customerId,
    status: statusMap[orderObj.status] || orderObj.status?.toLowerCase() || "draft",
    items,
    discounts,
    orderDiscount: orderObj.orderDiscount?.amount || 0,
    subtotal: orderObj.totals?.itemsSubtotal || 0,
    totalDiscount: (orderObj.totals?.itemsDiscount || 0) + (orderObj.totals?.orderDiscount || 0),
    total: orderObj.totals?.final || 0,
    tractor: orderObj.tractor || {},
    createdAt: orderObj.createdAt,
    updatedAt: orderObj.updatedAt,
  };
};

