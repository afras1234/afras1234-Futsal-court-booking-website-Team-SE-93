import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
      console.error("Token is missing");
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "MY_SECRET_KEY");
    console.log("Decoded Token:", decodedToken);  // Debugging

    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Specific error handling for expired tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }

    // General error handling for invalid tokens or malformed tokens
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
