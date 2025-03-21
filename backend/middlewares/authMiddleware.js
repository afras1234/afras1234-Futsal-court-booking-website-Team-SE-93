import jwt from 'jsonwebtoken';

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
