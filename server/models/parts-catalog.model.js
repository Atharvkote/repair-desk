import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    partCode: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    unit: {
      type: String,
      default: "piece",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "OUT_OF_STOCK", "DISABLED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

partSchema.pre("save", function () {
  if (this.stock === 0 && this.status === "AVAILABLE") {
    this.status = "OUT_OF_STOCK";
  } else if (this.stock > 0 && this.status === "OUT_OF_STOCK") {
    this.status = "AVAILABLE";
  }
});

export default mongoose.model("Part", partSchema, "parts");
