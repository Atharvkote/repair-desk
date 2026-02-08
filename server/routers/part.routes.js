import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createPart,
  getParts,
  getPartById,
  updatePart,
  deletePart,
} from "../controllers/part.controller.js";

const router = express.Router();

router.use(adminAuthMiddleware);

router.post("/", createPart);
router.get("/", getParts);
router.get("/:id", getPartById);
router.patch("/:id", updatePart);
// Only SUPER_ADMIN can delete parts
router.delete("/:id", authorize("SUPER_ADMIN"), deletePart);

export default router;

