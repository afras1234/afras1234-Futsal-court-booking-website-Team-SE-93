import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "MY_SECRET_KEY");
    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
