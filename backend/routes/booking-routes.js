import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  deleteBooking,
  getBookingById,
  newBooking,
} from "../controllers/booking-controller.js";

const bookingsRouter = express.Router();

bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", verifyToken, newBooking);
bookingsRouter.delete("/:id", verifyToken, deleteBooking);

export default bookingsRouter;
