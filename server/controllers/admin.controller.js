import adminModel from "../models/admin.model.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import { publicKey } from "../configs/jwt.config.js";
import "dotenv/config";

const createAdmin = async (req, res) => {
  try {
    const { phone, password, name, email, flag } = req.body;
    if (!phone || !password || !name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingAdmin = await adminModel.findOne({ phone });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ success: false, message: "Admin already exists" });
    }

    const admin = await adminModel.create({
      phone,
      password,
      name,
      email,
      role: flag === process.env.ADMIN_CYPER ? "SUPER_ADMIN" : "ADMIN",
    });
    const accessToken = await admin.generateToken("access");
    const refreshToken = await admin.generateToken("refresh");

    const data = {
      _id: admin._id,
      phone: admin.phone,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };

    res.status(201).json({
      success: true,
      data,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`[ADMIN] Error creating admin: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and password are required" });
    }
    const admin = await adminModel
      .findOne({ phone: phone })
      .select("+password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = await admin.generateToken("access");
    const refreshToken = await admin.generateToken("refresh");
    const data = {
      _id: admin._id,
      phone: admin.phone,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };
    res.status(200).json({
      success: true,
      data,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    logger.info("[ADMIN] Fetching all admins from database");

    const admins = await adminModel.find().select("-password");

    res.status(200).json({
      success: true,
      data: admins,
      count: admins.length,
    });
  } catch (error) {
    logger.error(`[ADMIN] Error fetching admins: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    logger.info(`[ADMIN] Fetching admin ${admin.id} from database`);

    const details = await adminModel.findById(admin.id).select("-password");

    if (!details) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: details,
      role: admin.role,
    });
  } catch (error) {
    logger.error(`[ADMIN] Error fetching admin: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin is authenticated",
    user: req.user,
  });
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token using public key (RS256)
    let decoded;
    try {
      decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        issuer: "repair-desk-admin",
        audience: "repair-desk-api",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired",
        });
      }
      logger.error(`Token refresh failed: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Ensure it's a refresh token
    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    // Get admin and generate new tokens
    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const newAccessToken = await admin.generateToken("access");
    const newRefreshToken = await admin.generateToken("refresh");

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { phone, name, email } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Admin ID is required" });
    }

    // PATCH allows partial updates - only validate fields that are provided
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field (phone, name, email) must be provided",
      });
    }

    const admin = await adminModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .select("-password");

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Admin ID is required" });
    }

    const admin = await adminModel.findByIdAndDelete(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const user = await adminModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createAdmin,
  loginAdmin,
  getAdmins,
  getUserDetails,
  getAdmin,
  checkAuth,
  updateAdmin,
  deleteAdmin,
  refreshToken,
};
