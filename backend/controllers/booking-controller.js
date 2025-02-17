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
    booking = await Bookings.findByIdAndRemove(id).populate("user futsalCourt");
    console.log(booking);
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.futsalCourt.bookings.pull(booking);
    await booking.futsalCourt.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
