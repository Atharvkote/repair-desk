import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import "dotenv/config";

export const authMiddleware = (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    logger.warn("No token provided");
    return res.status(401).json({ message: "Admin Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      phone: decoded.phone,
      email: decoded.email,
    };

    next();
  } catch (err) {
    logger.error("JWT verification failed");
    return res.status(401).json({ message: "Unauthorized" });
  }
};
