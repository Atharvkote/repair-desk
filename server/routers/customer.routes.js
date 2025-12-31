import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { searchCustomers, upsertCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/search", searchCustomers);
router.post("/upsert", upsertCustomer);

export default router;

