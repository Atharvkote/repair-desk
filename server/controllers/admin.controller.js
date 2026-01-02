import adminModel from "../models/admin.model.js";

const createAdmin = async (req, res) => {
  try {
    const { phone, password, name, email, flag } = req.body;
    if (!phone || !password || !name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingAdmin = await adminModel.findOne({ phone });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ success: false, message: "Admin already exists" });
    }

    const admin = await adminModel.create({
      phone,
      password,
      name,
      email,
      role: flag === process.env.ADMIN_CYPER ? "superadmin" : "admin",
    });
    const token = await admin.generateToken();

    const data = {
      _id: admin._id,
      phone: admin.phone,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };

    res.status(201).json({ success: true, data, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and password are required" });
    }
    const admin = await adminModel
      .findOne({ phone: phone })
      .select("+password");
    // console.log("[DEBUG] loginAdmin - queried phone:", phone);
    // console.log("[DEBUG] loginAdmin - admin found:", admin ? { _id: admin._id, phone: admin.phone, hasPassword: !!admin.password } : null);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    const isPasswordValid = await admin.comparePassword(password);
    // console.log("[DEBUG] loginAdmin - password comparison result:", isPasswordValid);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = await admin.generateToken();
    const data = {
      _id: admin._id,
      phone: admin.phone,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };
    res.status(200).json({ success: true, data, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find().select("-password");
    if (!admins) {
      return res
        .status(404)
        .json({ success: false, message: "No admins found" });
    }

    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const details = await adminModel.findById(admin.id).select("-password");

    if (!details) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: details, role: admin.role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin is authenticated",
    user: req.user,
  });
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { phone, name, email } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Admin ID is required" });
    }

    if (!phone || !name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Required" });
    }

    const admin = await adminModel
      .findByIdAndUpdate(id, { phone, name, email }, { new: true })
      .select("-password");

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Admin ID is required" });
    }

    const admin = await adminModel.findByIdAndDelete(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createAdmin,
  loginAdmin,
  getAdmins,
  getAdmin,
  checkAuth,
  updateAdmin,
  deleteAdmin,
};
