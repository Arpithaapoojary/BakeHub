import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const sign = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// Register customer
export const registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password, role: "customer" });
    res.status(201).json({ message: "Customer registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Register owner
export const registerOwner = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password, role: "owner" });
    res.status(201).json({ message: "Owner registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Register admin (fix added here)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password, role: "admin" });
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.compare(password)))
      return res.status(400).json({ error: "Invalid credentials" });

    const token = sign(user);
    res.json({
      token,
      role: user.role,
      name: user.name,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
