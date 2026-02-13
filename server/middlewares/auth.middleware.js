import jwt from "jsonwebtoken";
import { publicKey } from "../configs/jwt.config.js";
import logger from "../utils/logger.js";
import "dotenv/config";

/**
 * Middleware to verify JWT tokens (primary auth middleware)
 * Uses RS256 algorithm with public key loaded from environment variables
 * 
 * Note: This middleware uses JWT_SECRET for backward compatibility with HMAC tokens.
 * For RS256 tokens, use adminAuthMiddleware instead.
 */
export const authMiddleware = (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    logger.warn("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Try RS256 verification first (recommended)
    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      });

      req.user = {
        id: decoded.id,
        role: decoded.role,
        phone: decoded.phone,
        email: decoded.email,
      };

      return next();
    } catch (rsaError) {
      // Fallback to HMAC if RS256 fails (for backward compatibility)
      if (!process.env.JWT_SECRET) {
        throw rsaError;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        role: decoded.role,
        phone: decoded.phone,
        email: decoded.email,
      };

      return next();
    }
  } catch (err) {
    logger.error(`JWT verification failed: ${err.message}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
