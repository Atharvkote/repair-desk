import User from "../models/user.model.js";

export const searchCustomers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.status(200).json({
        success: true,
        data: [],
        message:"Search Something....."
      });
    }

    const customers = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .limit(10)
      .select("_id name phone email isActivated createdBy")
      .lean();


    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upsertCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    let customer = await User.findOne({ phone });

    if (customer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
    }

    customer = await User.create({
      name,
      phone,
      email,
      isActivated: false,
      createdBy: "ADMIN",
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        isActivated: customer.isActivated,
        createdBy: customer.createdBy,
      },
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


