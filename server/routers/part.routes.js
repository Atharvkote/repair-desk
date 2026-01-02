import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";
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
router.delete("/:id", deletePart);

export default router;

