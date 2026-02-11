import User from "../models/user.model.js";
 const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    let user = await User.findOne({ phone }).select("+password");

    if (user && !user.isActivated) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password;
      user.isActivated = true;
      user.createdBy = "SELF";

      await user.save();

      const token = await user.generateToken();

      return res.status(200).json({
        success: true,
        message: "Account activated successfully",
        data: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
        token,
      });
    }

    if (user && user.isActivated) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    user = await User.create({
      name,
      phone,
      email,
      password,
      isActivated: true,
      createdBy: "SELF",
    });

    const token = await user.generateToken();

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await user.generateToken();

    const data = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get logged-in user profile
 * @route GET /api/users/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/me
 */
const updateMe = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete user account
 * @route DELETE /api/users/me
 */
const deleteMe = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUser, loginUser, getMe, updateMe, deleteMe };
