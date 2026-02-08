/**
 * @file data.controller.js
 * @description Data controller for data endpoints
 */

import dataModel from "../models/data.model.js";
import logger from "../utils/logger.js";

/**
 * GET /api/data
 * Get all data items
 */
const getAllData = async (req, res) => {
  try {
    logger.info("[DATA] Fetching all data from database");
    
    const data = await dataModel.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: data,
      count: data.length,
    });
  } catch (error) {
    logger.error(`[DATA] Error fetching all data: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/data/:id
 * Get single data item by ID
 */
const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Data ID is required",
      });
    }

    logger.info(`[DATA] Fetching data by ID: ${id} from database`);
    
    const data = await dataModel.findById(id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    logger.error(`[DATA] Error fetching data by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/data
 * Create new data item
 */
const createData = async (req, res) => {
  try {
    const { name, description, value, metadata, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    logger.info("[DATA] Creating new data item");

    const newData = await dataModel.create({
      name,
      description,
      value: value || 0,
      metadata: metadata || {},
      status: status || "ACTIVE",
    });

    res.status(201).json({
      success: true,
      data: newData,
    });
  } catch (error) {
    logger.error(`[DATA] Error creating data: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PUT /api/data/:id
 * Update data item
 */
const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, value, metadata, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Data ID is required",
      });
    }

    logger.info(`[DATA] Updating data item: ${id}`);

    const updatedData = await dataModel.findByIdAndUpdate(
      id,
      { name, description, value, metadata, status },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    logger.error(`[DATA] Error updating data: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /api/data/:id
 * Delete data item
 */
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Data ID is required",
      });
    }

    logger.info(`[DATA] Deleting data item: ${id}`);

    const deletedData = await dataModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    logger.error(`[DATA] Error deleting data: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
};

