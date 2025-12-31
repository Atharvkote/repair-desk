import { Router } from "express";
import {
  checkAuth,
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  loginAdmin,
  updateAdmin,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createAdmin);
router.post("/login", loginAdmin);

router.get("/", getAdmins);
router.get("/:id", getAdmin);

router.get("/check-auth", authMiddleware, checkAuth);
router.patch("/:id", authMiddleware, updateAdmin);
router.delete("/:id", authMiddleware, deleteAdmin);

export default router;
