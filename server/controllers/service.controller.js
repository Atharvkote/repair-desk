import Service from "../models/service-catalog.model.js";

export const createService = async (req, res) => {
  try {
    const { serviceCode, name, description, price, status } = req.body;
console.log("Body" ,req.body);
    if (!serviceCode || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Service code, name, and price are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be non-negative",
      });
    }

    const service = await Service.create({
      serviceCode,
      name,
      description,
      price,
      status: status || "AVAILABLE",
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, status } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be non-negative",
        });
      }
      service.price = price;
    }
    if (status) service.status = status;

    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

