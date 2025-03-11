import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Default secret keys - DO NOT use these in production!
const DEFAULT_JWT_SECRET = "futsalapp2024secret";
const DEFAULT_ADMIN_SECRET = "12345";

export const addAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, secretKey } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !phone || !secretKey) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Validate secret key
    const validSecretKey = process.env.ADMIN_SECRET_KEY || DEFAULT_ADMIN_SECRET;
    if (secretKey !== validSecretKey) {
      return res.status(400).json({ message: "Invalid secret key" });
    }

    try {
      // Check for existing admin with same email
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ 
          message: "An admin with this email already exists. Please use a different email or login instead." 
        });
      }

      // Create new admin
      const hashedPassword = bcrypt.hashSync(password);
      const admin = new Admin({ 
        name,
        email, 
        password: hashedPassword,
        phone
      });
      
      await admin.save();

      const token = jwt.sign(
        { id: admin._id }, 
        process.env.SECRET_KEY || DEFAULT_JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ 
        message: "Admin account created successfully",
        token,
        id: admin._id
      });

    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ 
          message: "This email is already registered. Please use a different email or login instead." 
        });
      }
      throw err;
    }

  } catch (err) {
    console.error("Admin signup error:", err);
    return res.status(500).json({ 
      message: "Error creating admin account. Please try again later.",
      error: err.message 
    });
  }
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(422).json({ message: "Email and password are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    
    if (!existingAdmin) {
      return res.status(400).json({ message: "Admin account not found. Please check your email or sign up." });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      { id: existingAdmin._id }, 
      process.env.SECRET_KEY || DEFAULT_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ 
      message: "Login successful",
      token, 
      id: existingAdmin._id 
    });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ 
      message: "Error during login. Please try again later." 
    });
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({ admins });
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ message: "Error fetching admin list" });
  }
};

export const getAdminById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const admin = await Admin.findById(id).populate("addedFutsalCourts");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ admin });
  } catch (err) {
    console.error("Error fetching admin:", err);
    return res.status(500).json({ message: "Error fetching admin details" });
  }
};
