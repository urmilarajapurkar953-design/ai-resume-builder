import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

// TOKEN
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    newUser.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    user.password = undefined;

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET USER =================
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;

    return res.status(200).json({ user });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
    });
  }
};

// ================= FORGOT PASSWORD (OTP SHOW IN UI) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ SEND OTP IN RESPONSE (FOR UI)
    return res.status(200).json({
      message: "OTP generated",
      otp, // 🔥 THIS FIXES YOUR ISSUE
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ================= GET USER RESUMES =================
export const getUserResume = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId });

    return res.status(200).json({
      resumes,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching resumes",
    });
  }
};