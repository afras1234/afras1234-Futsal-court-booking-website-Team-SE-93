import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import FutsalCourt from "../models/FutsalCourt.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { futsalCourt, date, timeSlot, user } = req.body;

  let existingFutsalCourt;
  let existingUser;
  try {
    existingFutsalCourt = await FutsalCourt.findById(futsalCourt);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingFutsalCourt) {
    return res.status(404).json({ message: "Futsal Court Not Found With Given ID" });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
  let booking;

  try {
    booking = new Bookings({
      futsalCourt,
      date: new Date(`${date}`),
      timeSlot,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingFutsalCourt.bookings.push(booking);
    await existingUser.save({ session });
    await existingFutsalCourt.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    // First find the booking and populate user details
    booking = await Bookings.findById(id).populate("user futsalCourt");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the logged-in user owns this booking
    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }

    // Proceed with deletion
    const session = await mongoose.startSession();
    session.startTransaction();
    
    await Bookings.findByIdAndRemove(id);
    await booking.user.bookings.pull(booking);
    await booking.futsalCourt.bookings.pull(booking);
    await booking.futsalCourt.save({ session });
    await booking.user.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({ message: "Error deleting booking" });
  }
};
