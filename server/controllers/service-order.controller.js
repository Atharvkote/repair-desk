import ServiceOrder from "../models/service.model.js";
import User from "../models/user.model.js";
import Part from "../models/parts-catalog.model.js";
import Service from "../models/service-catalog.model.js";
import { recalcOrder } from "../utils/recalc-order.js";
import { transformOrderForFrontend } from "../utils/order-transform.js";

let ioInstance = null;

export const setIOInstance = (io) => {
  ioInstance = io;
};

const emitOrderUpdate = (orderId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`order:${orderId}`).emit(event, data);
  }
};

const validateOrderStatus = (order, allowedStatuses, action) => {
  if (!order) {
    throw new Error("Order not found");
  }
  if (!allowedStatuses.includes(order.status)) {
    throw new Error(
      `Cannot ${action} order with status ${order.status}. Allowed statuses: ${allowedStatuses.join(", ")}`
    );
  }
};

export const searchCustomers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const customers = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .limit(10)
      .select("_id name phone email isActivated createdBy")
      .lean();

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upsertCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    let customer = await User.findOne({ phone });

    if (customer) {
      customer.name = name;
      if (email) customer.email = email;
      if (!customer.createdBy) {
        customer.createdBy = "ADMIN";
      }
      await customer.save();

      return res.status(200).json({
        success: true,
        data: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          isActivated: customer.isActivated,
          createdBy: customer.createdBy,
        },
      });
    }

    customer = await User.create({
      name,
      phone,
      email,
      isActivated: false,
      createdBy: "ADMIN",
    });

    res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        isActivated: customer.isActivated,
        createdBy: customer.createdBy,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createDraftOrder = async (req, res) => {
  try {
    const { customerId, tractor } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const orderData = {
      customerId,
      status: "DRAFT",
      items: [],
      orderDiscount: { type: "NONE", amount: 0 },
      totals: {
        itemsSubtotal: 0,
        itemsDiscount: 0,
        orderDiscount: 0,
        final: 0,
      },
      createdBy: req.user.id,
    };

    if (tractor && (tractor.name || tractor.model)) {
      orderData.tractor = {
        name: tractor.name || "",
        model: tractor.model || "",
      };
    }

    const order = await ServiceOrder.create(orderData);

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);

    res.status(201).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTractor = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { name, model } = req.body;

    if (!name || !model) {
      return res.status(400).json({
        success: false,
        message: "Tractor name and model are required",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "update tractor");

    order.tractor = { name, model };
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addServiceItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { serviceId, quantity } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "add service");

    const service = await Service.findOne({
      $or: [{ _id: serviceId }, { serviceCode: serviceId }],
    });

    if (!service || service.status !== "AVAILABLE") {
      return res.status(404).json({
        success: false,
        message: "Service not found or unavailable",
      });
    }

    const qty = quantity || 1;
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be positive",
      });
    }

    order.items.push({
      itemType: "SERVICE",
      serviceId: service._id,
      name: service.name,
      unitPrice: service.price,
      quantity: qty,
      discount: { type: "PERCENT", value: 0 },
      lineTotals: {
        subtotal: service.price * qty,
        discount: 0,
        final: service.price * qty,
      },
    });

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addPartItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { partId, quantity } = req.body;

    if (!partId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Part ID and valid quantity are required",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "add part");

    const part = await Part.findOne({
      $or: [{ _id: partId }, { partCode: partId }],
    });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    if (part.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "Part is not available",
      });
    }

    if (part.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${part.stock}, Requested: ${quantity}`,
      });
    }

    order.items.push({
      itemType: "PART",
      partId: part._id,
      name: part.name,
      unitPrice: part.price,
      quantity,
      discount: { type: "PERCENT", value: 0 },
      lineTotals: {
        subtotal: part.price * quantity,
        discount: 0,
        final: part.price * quantity,
      },
    });

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItemDiscount = async (req, res) => {
  try {
    const { orderId, index } = req.params;
    const { type, value } = req.body;

    if (!type || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Discount type and value are required",
      });
    }

    if (!["PERCENT", "FLAT"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be PERCENT or FLAT",
      });
    }

    if (value < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be non-negative",
      });
    }

    if (type === "PERCENT" && value > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "update item discount");

    const itemIndex = parseInt(index);
    if (itemIndex < 0 || itemIndex >= order.items.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    order.items[itemIndex].discount = { type, value };
    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderDiscount = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, discountAmount } = req.body;

    const discount = amount !== undefined ? amount : discountAmount;

    if (discount === undefined || discount < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount amount must be a non-negative number",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "update order discount");

    order.orderDiscount = {
      type: discount > 0 ? "FLAT" : "NONE",
      amount: discount,
    };

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const startOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await ServiceOrder.findById(orderId).populate("customerId");
    validateOrderStatus(order, ["DRAFT"], "start");

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot start order without items",
      });
    }

    for (const item of order.items) {
      if (item.itemType === "PART") {
        const part = await Part.findById(item.partId);
        if (!part) {
          return res.status(404).json({
            success: false,
            message: `Part ${item.name} not found`,
          });
        }
        if (part.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}. Available: ${part.stock}, Required: ${item.quantity}`,
          });
        }
      }
    }

    for (const item of order.items) {
      if (item.itemType === "PART") {
        await Part.findByIdAndUpdate(item.partId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    order.status = "ONGOING";
    order.startedAt = new Date();
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:started", transformed);
    console.log(transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["ONGOING"], "complete");

    order.status = "COMPLETED";
    order.completedAt = new Date();
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:completed", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT", "ONGOING"], "cancel");

    if (order.status === "ONGOING") {
      for (const item of order.items) {
        if (item.itemType === "PART") {
          await Part.findByIdAndUpdate(item.partId, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    order.status = "CANCELLED";
    order.cancelledAt = new Date();
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:cancelled", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await ServiceOrder.findById(orderId)
      .populate("customerId", "name phone email")
      .populate("createdBy", "name")
      .populate("items.serviceId")
      .populate("items.partId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const transformed = transformOrderForFrontend(order);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, customerId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;

    const orders = await ServiceOrder.find(filter)
      .populate("customerId", "name phone email")
      .populate("createdBy", "name")
      .populate("items.serviceId")
      .populate("items.partId")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, quantity, type } = req.body;
    console.log("itemid" + itemId);
    console.log("type" + type);
    console.log("quantity" + quantity);
    if (!itemId || !type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required",
      });
    }

    const qty = quantity || 1;
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be positive",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "add item");

    if (type === "service") {
      const service = await Service.findOne({
        $or: [{ _id: itemId }, { serviceCode: itemId }],
      });

      if (!service || service.status !== "AVAILABLE") {
        return res.status(404).json({
          success: false,
          message: "Service not found or unavailable",
        });
      }

      const existingIndex = order.items.findIndex(
        (item) => item.itemType === "SERVICE" && item.serviceId?.toString() === service._id.toString()
      );

      if (existingIndex >= 0) {
        order.items[existingIndex].quantity += qty;
      } else {
        order.items.push({
          itemType: "SERVICE",
          serviceId: service._id,
          name: service.name,
          unitPrice: service.price,
          quantity: qty,
          discount: { type: "PERCENT", value: 0 },
        });
      }
    } else if (type === "part") {
      const part = await Part.findOne({
        $or: [{ _id: itemId }, { partCode: itemId }],
      });

      if (!part) {
        return res.status(404).json({
          success: false,
          message: "Part not found",
        });
      }

      if (part.status !== "AVAILABLE") {
        return res.status(400).json({
          success: false,
          message: "Part is not available",
        });
      }

      const existingIndex = order.items.findIndex(
        (item) => item.itemType === "PART" && item.partId?.toString() === part._id.toString()
      );

      const totalQuantity = existingIndex >= 0 ? order.items[existingIndex].quantity + qty : qty;

      if (part.stock < totalQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${part.stock}, Requested: ${totalQuantity}`,
        });
      }

      if (existingIndex >= 0) {
        order.items[existingIndex].quantity = totalQuantity;
      } else {
        order.items.push({
          itemType: "PART",
          partId: part._id,
          name: part.name,
          unitPrice: part.price,
          quantity: qty,
          discount: { type: "PERCENT", value: 0 },
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid item type. Must be 'service' or 'part'",
      });
    }

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "remove item");

    const itemIndex = order.items.findIndex((item) => {
      if (item.itemType === "SERVICE") {
        return item.serviceId?.toString() === itemId;
      } else {
        return item.partId?.toString() === itemId;
      }
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
      });
    }

    order.items.splice(itemIndex, 1);
    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "update item quantity");

    const itemIndex = order.items.findIndex((item) => {
      if (item.itemType === "SERVICE") {
        return item.serviceId?.toString() === itemId;
      } else {
        return item.partId?.toString() === itemId;
      }
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
      });
    }

    const item = order.items[itemIndex];

    if (item.itemType === "PART") {
      const part = await Part.findById(item.partId);
      if (!part) {
        return res.status(404).json({
          success: false,
          message: "Part not found",
        });
      }
      if (part.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${part.stock}, Requested: ${quantity}`,
        });
      }
    }

    order.items[itemIndex].quantity = quantity;
    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItemDiscountById = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { discountPercent } = req.body;

    if (discountPercent === undefined || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount percent must be between 0 and 100",
      });
    }

    const order = await ServiceOrder.findById(orderId);
    validateOrderStatus(order, ["DRAFT"], "update item discount");

    const itemIndex = order.items.findIndex((item) => {
      if (item.itemType === "SERVICE") {
        return item.serviceId?.toString() === itemId;
      } else {
        return item.partId?.toString() === itemId;
      }
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
      });
    }

    order.items[itemIndex].discount = {
      type: "PERCENT",
      value: discountPercent,
    };

    recalcOrder(order);
    await order.save();

    const transformed = transformOrderForFrontend(order);
    emitOrderUpdate(orderId, "order:updated", transformed);
    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
