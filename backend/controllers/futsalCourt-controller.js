import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import FutsalCourt from "../models/FutsalCourt.js";

export const addFutsalCourt = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // verify token
  try {
    const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decoded.id;
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const { title, description, openingDate, websiteUrl, featured, locations } =
    req.body;

  if (
    !title || title.trim() === "" ||
    !description || description.trim() === "" ||
    !websiteUrl || websiteUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  // Ensure websiteUrl starts with http:// or https://
  const formattedWebsiteUrl = websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://")
    ? websiteUrl
    : `https://${websiteUrl}`;

  let futsalCourt;
  try {
    futsalCourt = new FutsalCourt({
      description,
      openingDate: new Date(`${openingDate}`),
      featured,
      locations,
      admin: adminId,
      websiteUrl: formattedWebsiteUrl, // Save formatted URL
      title,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await futsalCourt.save({ session });
    adminUser.addedFutsalCourts.push(futsalCourt);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!futsalCourt) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ futsalCourt });
};

export const getAllFutsalCourts = async (req, res, next) => {
  let futsalCourts;

  try {
    futsalCourts = await FutsalCourt.find();
  } catch (err) {
    return console.log(err);
  }

  if (!futsalCourts) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(200).json({ futsalCourts });
};

export const getFutsalCourtById = async (req, res, next) => {
  const id = req.params.id;
  let futsalCourt;
  try {
    futsalCourt = await FutsalCourt.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!futsalCourt) {
    return res.status(404).json({ message: "Invalid Futsal Court ID" });
  }

  return res.status(200).json({ futsalCourt });
};
