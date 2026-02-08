/**
 * @file data.routes.js
 * @description Routes for data endpoints
 */

import express from "express";
import {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/", getAllData);
router.get("/:id", getDataById);
router.post("/", createData);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

export default router;

