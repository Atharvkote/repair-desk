import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    password: { type: String, required: false, minlength: 6, select: false },
    address: {
      residential_address: { type: String },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      pincode: {
        type: String,
        match: /^[0-9]{6}$/,
      },
    },
    isActivated: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: String,
      enum: ["ADMIN", "SELF"],
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      phone: this.phone,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default mongoose.model("User", userSchema, "users");
