import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";
import { searchCustomers, upsertCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/search", searchCustomers);
router.post("/upsert", upsertCustomer);

export default router;

