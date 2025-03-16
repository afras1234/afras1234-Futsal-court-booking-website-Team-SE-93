import mongoose from "mongoose";

const futsalCourtSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  location: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  facilities: {
    type: [String],
    default: [],
  },
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
