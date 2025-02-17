import mongoose from "mongoose";

const futsalCourtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  locations: [{ type: String, required: true }],
  openingDate: {
    type: Date,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v);
      },
      message: "Invalid URL format",
    },
    set: function (v) {
      return v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v}`;
    },
  },
  featured: {
    type: Boolean,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

export default mongoose.model("FutsalCourt", futsalCourtSchema);
