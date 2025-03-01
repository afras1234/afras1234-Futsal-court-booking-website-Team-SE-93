import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
console.log(process.env.SECRET_KEY); // Access environment variable
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// Password Reset
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Using salt rounds of 10

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Google Authentication
export const googleAuth = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid Google token" });
  }

  const { name, email } = ticket.getPayload();
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, password: "" });
    await user.save();
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ message: "Google Authentication Successful", token: jwtToken, userId: user._id });
};

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ users });
};

// Signup function
export const signup = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  try {
    console.log("\nSignup attempt with data:", {
      name: name || 'missing',
      email: email || 'missing',
      password: password ? 'provided' : 'missing',
      phone: phone || 'missing'
    });

    // Input validation
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!phone) missingFields.push('phone');

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }

    // Password validation
    if (password.length < 6) {
      console.log("Password too short");
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    // Check if user already exists
    console.log("Checking for existing user with email:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log("Creating new user...");
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    // Save user
    console.log("Attempting to save user...");
    await user.save();
    console.log("User saved successfully!");

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: "1h" }
    );

    console.log("Sending success response...");
    return res.status(201).json({
      message: "User created successfully",
      id: user._id,
      token
    });

  } catch (err) {
    console.error("\nSignup error details:");
    console.error("→ Error name:", err.name);
    console.error("→ Error message:", err.message);
    if (err.code === 11000) {
      console.error("→ Duplicate key error");
      return res.status(400).json({
        message: "Email already in use",
        error: "duplicate_email"
      });
    }
    if (err.name === 'ValidationError') {
      console.error("→ Validation error details:", err.errors);
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {})
      });
    }
    console.error("→ Full error:", err);
    return res.status(500).json({
      message: "Error creating user",
      error: err.message
    });
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (errr) {
    return console.log(errr);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Sucessfully" });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ message: "Error finding user" });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET || "MY_SECRET_KEY",
    { expiresIn: "1h" }
  );

  return res
    .status(200)
    .json({
      message: "Login Successful",
      id: existingUser._id,
      token: token
    });
};

export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate("futsalCourt")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};

export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // Update user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.phone = phone;
    user.bio = bio || user.bio;

    // Handle profile image if uploaded
    if (req.file) {
      // Convert Windows path to URL format
      const imagePath = req.file.path.replace(/\\/g, '/');
      user.profileImage = `http://localhost:5000/${imagePath}`;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
