import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import FutsalCourt from "../models/FutsalCourt.js";

/**
 * Add a new Futsal Court
 */
export const addFutsalCourt = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token Not Found" });
    }

    let adminId;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      adminId = decoded.id;
    } catch (err) {
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }

    const {
      title,
      description,
      openingDate,
      websiteUrl,
      featured,
      location, // Changed from locations to location (assuming it's a single string)
      image,
      price,
      rating,
      isNew,
      facilities = [],
    } = req.body;

    // Validate required fields
    if (
      !title || title.trim() === "" ||
      !description || description.trim() === "" ||
      !image || image.trim() === "" ||
      !websiteUrl || websiteUrl.trim() === "" ||
      !location || location.trim() === "" ||
      price == null || isNaN(price) || price < 0 ||
      rating == null || isNaN(rating) || rating < 0 || rating > 5
    ) {
      return res.status(422).json({ message: "Invalid Inputs: Please provide valid details." });
    }

    // Ensure websiteUrl starts with http:// or https://
    const formattedWebsiteUrl = websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://")
      ? websiteUrl
      : `https://${websiteUrl}`;

    const formattedOpeningDate = openingDate ? new Date(openingDate) : new Date();

    const session = await mongoose.startSession();
    session.startTransaction();

    const adminUser = await Admin.findById(adminId).session(session);
    if (!adminUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Admin not found" });
    }

    const futsalCourt = new FutsalCourt({
      title,
      description,
      openingDate: formattedOpeningDate,
      websiteUrl: formattedWebsiteUrl,
      featured,
      location, // Single location instead of array
      admin: adminId,
      image,
      price: Number(price),
      rating: Number(rating),
      isNew: Boolean(isNew),
      facilities: Array.isArray(facilities) ? facilities.map(f => f.trim()) : [],
    });

    await futsalCourt.save({ session });

    adminUser.addedFutsalCourts.push(futsalCourt);
    await adminUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ futsalCourt });
  } catch (err) {
    console.error("Error saving futsal court:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all futsal courts
 */
export const getAllFutsalCourts = async (req, res, next) => {
  try {
    const futsalCourts = await FutsalCourt.find();
    if (!futsalCourts || futsalCourts.length === 0) {
      return res.status(404).json({ message: "No Futsal Courts Found" });
    }
    return res.status(200).json({ futsalCourts });
  } catch (err) {
    console.error("Error fetching futsal courts:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get a futsal court by ID
 */
export const getFutsalCourtById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Futsal Court ID" });
    }

    const futsalCourt = await FutsalCourt.findById(id);

    if (!futsalCourt) {
      return res.status(404).json({ message: "Futsal Court Not Found" });
    }

    return res.status(200).json({ futsalCourt });
  } catch (err) {
    console.error("Error fetching futsal court by ID:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
