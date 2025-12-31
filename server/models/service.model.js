import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["SERVICE", "PART"],
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
    },

    name: String,
    unitPrice: Number,

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    discount: {
      type: {
        type: String,
        enum: ["PERCENT", "FLAT"],
        default: "PERCENT",
      },
      value: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    lineTotals: {
      subtotal: Number,
      discount: Number,
      final: Number,
    },
  },
  { _id: false }
);

const serviceOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["DRAFT","ONGOING", "COMPLETED", "CANCELLED"],
      default: "DRAFT",
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tractor: {
      name: String,
      model: String,
    },

    items: [orderItemSchema],

    orderDiscount: {
      type: {
        type: String,
        enum: ["NONE", "FLAT"],
        default: "NONE",
      },
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    totals: {
      itemsSubtotal: Number,
      itemsDiscount: Number,
      orderDiscount: Number,
      final: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

serviceOrderSchema.pre("save", async function () {
  if (this.isNew && !this.orderNumber) {
    try {
      const lastOrder = await mongoose.model("ServiceOrder")
        .findOne({}, { orderNumber: 1 })
        .sort({ createdAt: -1 })
        .lean();

      let nextNumber = 1;
      if (lastOrder?.orderNumber) {
        const match = lastOrder.orderNumber.match(/\d+$/);
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }

      this.orderNumber = `ORD-${String(nextNumber).padStart(6, "0")}`;
    } catch (error) {
      const count = await mongoose.model("ServiceOrder").countDocuments();
      this.orderNumber = `ORD-${String(count + 1).padStart(6, "0")}`;
    }
  }
});

const ServiceOrder = mongoose.model(
  "ServiceOrder",
  serviceOrderSchema,
  "service_orders"
);
export default ServiceOrder;
