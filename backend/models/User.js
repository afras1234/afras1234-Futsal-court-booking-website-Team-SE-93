import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    minLength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  googleId: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);