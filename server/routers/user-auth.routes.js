import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  deleteMe,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.delete("/me", authMiddleware, deleteMe);

export default router;
