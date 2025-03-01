import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import futsalCourtRouter from "./routes/futsalCourt-routes.js";
import bookingsRouter from "./routes/booking-routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/futsalCourt", futsalCourtRouter);
app.use("/booking", bookingsRouter);

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to Futsal Court Booking API');
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/futsal-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});