import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.use(adminAuthMiddleware);

router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.patch("/:id", updateService);
// Only SUPER_ADMIN can delete services
router.delete("/:id", authorize("SUPER_ADMIN"), deleteService);

export default router;

