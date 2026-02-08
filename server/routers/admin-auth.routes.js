import { Router } from "express";
import {
  checkAuth,
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  loginAdmin,
  updateAdmin,
  refreshToken,
  getUserDetails,
} from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";

const router = Router();

router.post("/", createAdmin);
router.post("/login", loginAdmin);

router.get("/", adminAuthMiddleware, getAdmins);
router.get("/me", adminAuthMiddleware, getAdmin);
router.get("/user/:id", adminAuthMiddleware, getUserDetails);

router.get("/check-auth", adminAuthMiddleware, checkAuth);
router.post("/refresh", refreshToken);
router.patch("/:id", adminAuthMiddleware, updateAdmin);
router.delete("/:id", adminAuthMiddleware, deleteAdmin);

export default router;
