import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  addedFutsalCourts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "FutsalCourt",
    },
  ],
});

export default mongoose.model("Admin", adminSchema);
