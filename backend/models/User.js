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
    required: false, // Password may not be required for Google-authenticated users
    minLength: 6,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  googleId: {
    type: String,
    required: false, // Store Google ID for users signing in with Google
  },
});

export default mongoose.model("User", userSchema);