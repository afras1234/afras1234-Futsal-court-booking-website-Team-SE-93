import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "futsalapp2024secret");
    const admin = await Admin.findById(decodedToken.id);

    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin not found" });
    }

    req.adminId = decodedToken.id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}; 

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "futsalapp2024secret");
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};