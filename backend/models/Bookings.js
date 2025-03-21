import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  futsalCourt: {
    type: mongoose.Types.ObjectId,
    ref: "FutsalCourt",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  payment: {},
  buyer: {
    type: mongoose.ObjectId,
    ref: "users",
  },
});

export default mongoose.model("Booking", bookingSchema);
