import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;

