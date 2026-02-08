import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { privateKey } from "../configs/jwt.config.js";
import "dotenv/config";


const adminSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], default: "ADMIN" },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.generateToken = async function (type = "access") {
  const expiresIn = type === "refresh" ? "30d" : "15m";
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      phone: this.phone,
      email: this.email,
      type,
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn,
      issuer: "repair-desk-admin",
      audience: "repair-desk-api",
    }
  );
};

export default mongoose.model("Admin", adminSchema, "admins");
