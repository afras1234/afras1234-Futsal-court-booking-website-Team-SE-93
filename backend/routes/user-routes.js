import express from "express";
import {
  deleteUser,
  resetPassword,
  googleAuth,
  getAllUsers,
  getBookingsOfUser,
  getUserById,
  login,  // Ensure 'login' is correctly imported
  singup, // Ensure 'signup' is correctly spelled
  updateUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", singup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login); // This is correct
userRouter.get("/bookings/:id", getBookingsOfUser);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/google-auth", googleAuth);

export default userRouter;
