import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin-auth-middleware.js";
import {
  addPartItem,
  addServiceItem,
  addItem,
  removeItem,
  updateItemQuantity,
  updateItemDiscountById,
  updateOrderDiscount,
  updateTractor,
  createDraftOrder,
  updateItemDiscount,
  startOrder,
  completeOrder,
  cancelOrder,
  deleteOrder,
  getOrderById,
  getOrders,
} from "../controllers/service-order.controller.js";

const router = express.Router();

router.use(adminAuthMiddleware);

router.post("/draft", createDraftOrder);
router.get("/", getOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/tractor", updateTractor);
router.post("/:orderId/service", addServiceItem);
router.post("/:orderId/part", addPartItem);
router.post("/:orderId/items", addItem);
router.delete("/:orderId/items/:itemId", removeItem);
router.patch("/:orderId/items/:itemId", updateItemQuantity);
router.patch("/:orderId/items/:itemId/discount", updateItemDiscountById);
router.patch("/:orderId/item/:index/discount", updateItemDiscount);
router.patch("/:orderId/discount", updateOrderDiscount);
router.post("/:orderId/start", startOrder);
router.post("/:orderId/complete", completeOrder);
router.post("/:orderId/cancel", cancelOrder);
router.delete("/:orderId", deleteOrder);

export default router;
