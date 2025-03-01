import express from "express";
import {
  getAllUsers,
  getUserById,
  getBookingsOfUser,
  login,
  signup,
  updateUser,
  updateProfile,
  resetPassword,
  googleAuth,
} from "../controllers/user-controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg and .png format allowed!"));
    }
  }
});

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/:id", updateUser);
userRouter.get("/bookings/:id", getBookingsOfUser);
userRouter.patch("/profile", verifyToken, upload.single("profileImage"), updateProfile);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/google-auth", googleAuth);

export default userRouter;
