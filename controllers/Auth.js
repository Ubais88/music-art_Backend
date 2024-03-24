const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup Controller for Registering USers
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { name, email, mobile, password } = req.body;

    // Check if All Details are there or not
    if (!name || !email || !mobile || !password) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if password meets minimum length requirement
    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters long.",
      });
    }

    // Check if user already exists
    const existingByEmail = await User.findOne({ email });
    const existingByMobile = await User.findOne({ mobile });
    if (existingEmail || existingMobile) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};
