import jwt from "jsonwebtoken";
import { publicKey } from "../configs/jwt.js";
import logger from "../utils/logger.js";

export const adminAuthMiddleware = (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    logger.warn(`Admin auth: No token provided for ${req.method} ${req.path}`);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "repair-desk-admin",
      audience: "repair-desk-api",
    });

    // Ensure all required fields are present
    if (!decoded.id) {
      logger.error("Admin auth: Token missing required field 'id'");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token structure",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role || "admin",
      phone: decoded.phone,
      email: decoded.email,
    };

    logger.info(`Admin auth: Successfully authenticated admin ${decoded.id} for ${req.method} ${req.path}`);
    next();
  } catch (err) {
    logger.error(`Admin auth: JWT verification failed for ${req.method} ${req.path} - ${err.name}: ${err.message}`);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      logger.error(`Admin auth: JWT error details - ${err.message}`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    if (err.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token not active yet",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Token verification failed",
    });
  }
};

