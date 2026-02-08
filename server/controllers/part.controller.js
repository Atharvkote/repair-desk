import Part from "../models/parts-catalog.model.js";
import logger from "../utils/logger.js";

export const createPart = async (req, res) => {
  try {
    const { partCode, name, description, unit, price, stock, status } = req.body;

    if (!partCode || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Part code, name, price, and stock are required",
      });
    }

    if (price < 0 ) {
      return res.status(400).json({
        success: false,
        message: "Price and stock must be non-negative",
      });
    }

    const part = await Part.create({
      partCode,
      name,
      description,
      unit: unit || "piece",
      price,
      stock :stock || 0,
      status: status || (stock > 0 ? "AVAILABLE" : "OUT_OF_STOCK"),
    });

    res.status(201).json({
      success: true,
      data: part,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Part code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getParts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    logger.info("[PART] Fetching parts from database", { status });

    const parts = await Part.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items: parts,
    });
  } catch (error) {
    logger.error(`[PART] Error fetching parts: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPartById = async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info(`[PART] Fetching part ${id} from database`);
    
    const part = await Part.findById(id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    res.status(200).json({
      success: true,
      data: part,
    });
  } catch (error) {
    logger.error(`[PART] Error fetching part by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unit, price, stock, status } = req.body;

    const part = await Part.findById(id);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    if (name) part.name = name;
    if (description !== undefined) part.description = description;
    if (unit) part.unit = unit;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be non-negative",
        });
      }
      part.price = price;
    }
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be non-negative",
        });
      }
      part.stock = stock;
    }
    if (status) part.status = status;

    await part.save();

    res.status(200).json({
      success: true,
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePart = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user?.role !== "SUPER_ADMIN") {
      logger.warn(
        `Delete part: User ${req.user?.id} with role ${req.user?.role} attempted to delete part (requires SUPER_ADMIN)`
      );
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only SUPER_ADMIN can delete parts",
      });
    }

    const { id } = req.params;
    const part = await Part.findByIdAndDelete(id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    logger.info(`Part ${id} deleted by SUPER_ADMIN ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: "Part deleted successfully",
    });
  } catch (error) {
    logger.error(`Error deleting part: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

