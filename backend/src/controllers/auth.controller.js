import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import { sendMail } from "../utils/mailer.js";
import Bakery from "../models/bakery.model.js";

// ------------------ REGISTER CUSTOMER ------------------
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: "customer",
    });

    res.json({ message: "Customer registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ REGISTER OWNER ------------------
export const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: "owner",
    });

    // ⭐ Auto-create bakery request
    await Bakery.create({
      name: `${name}'s Bakery`,
      address: "Not provided",
      ownerId: user._id,
      status: "pending",
    });

    res.json({
      message: "Owner registered. Bakery approval request created.",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ REGISTER ADMIN ------------------
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.json({ message: "Admin registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login success",
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const { token, tokenHash } = PasswordResetToken.createTokenPair();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await PasswordResetToken.findOneAndUpdate(
      { userId: user._id },
      { tokenHash, expiresAt },
      { upsert: true, new: true }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const html = `
      <p>Hello ${user.name || ""},</p>
      <p>Click the link below to reset your password (valid 1 hour):</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
    `;

    await sendMail({
      to: user.email,
      subject: "BakeHub — Reset your Password",
      html,
    });

    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("forgotPassword:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ RESET PASSWORD ------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ error: "Token and password required" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const record = await PasswordResetToken.findOne({ tokenHash });

    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ error: "Token invalid or expired" });

    const user = await User.findById(record.userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = password;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: record._id });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ ADMIN: GET ALL USERS ------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
