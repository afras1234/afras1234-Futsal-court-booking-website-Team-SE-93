import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  addedFutsalCourts: [{
    type: mongoose.Types.ObjectId,
    ref: "FutsalCourt"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for email uniqueness
adminSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to trim strings
adminSchema.pre('save', function(next) {
  if (this.isModified('name')) this.name = this.name.trim();
  if (this.isModified('email')) this.email = this.email.trim().toLowerCase();
  if (this.isModified('phone')) this.phone = this.phone.trim();
  next();
});

export default mongoose.model("Admin", adminSchema);
