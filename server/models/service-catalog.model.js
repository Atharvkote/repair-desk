import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceCode: {
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

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "DISABLED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema, "services");
