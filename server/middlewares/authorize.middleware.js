import logger from "../utils/logger.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn(`Authorization: No user found in request for ${req.method} ${req.path}`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required",
      });
    }

    const userRole = req.user.role;

    const normalizedUserRole = userRole?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      logger.warn(
        `Authorization: User ${req.user.id} with role ${userRole} attempted to access ${req.method} ${req.path} (requires: ${allowedRoles.join(", ")})`
      );
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }

    logger.info(
      `Authorization: User ${req.user.id} with role ${userRole} authorized for ${req.method} ${req.path}`
    );
    next();
  };
};

