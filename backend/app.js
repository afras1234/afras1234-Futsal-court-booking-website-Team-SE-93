import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  

import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import futsalCourtRouter from "./routes/futsalCourt-routes.js";
import bookingsRouter from "./routes/booking-routes.js";

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Configure mongoose
mongoose.set('strictQuery', true);

const app = express();

// Middleware - Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow both localhost and IP
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/futsalCourt", futsalCourtRouter);
app.use("/booking", bookingsRouter);

// API Routes documentation endpoint
app.get('/api-routes', (req, res) => {
  res.json({
    available_routes: {
      health: {
        GET: '/health - Check system health and MongoDB connection'
      },
      users: {
        GET: '/users - Get all users',
        POST: '/users - Create a new user'
      },
      futsalCourt: {
        GET: '/futsalCourt - Get all futsal courts',
        POST: '/futsalCourt - Create a new futsal court',
        GET_ONE: '/futsalCourt/:id - Get a specific futsal court',
        PUT: '/futsalCourt/:id - Update a futsal court',
        DELETE: '/futsalCourt/:id - Delete a futsal court'
      },
      bookings: {
        GET: '/booking - Get all bookings',
        POST: '/booking - Create a new booking',
        GET_ONE: '/booking/:id - Get a specific booking',
        PUT: '/booking/:id - Update a booking',
        DELETE: '/booking/:id - Delete a booking'
      }
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.json({
      status: 'OK',
      timestamp: new Date(),
      mongodb: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      services: {
        backend: 'Running',
        database: dbStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: error.message
    });
  }
});

// MongoDB Atlas connection string
const mongoURI = process.env.MONGO_URI;

// Debug MongoDB connection
mongoose.set('debug', true);

console.log("\nStarting server with configuration:");
console.log("→ MongoDB URI:", mongoURI);
console.log("→ Port:", process.env.PORT);
console.log("→ Environment:", process.env.NODE_ENV || 'development');

// Connect to MongoDB with better error handling
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("\n✓ Successfully connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`\n✓ Server is running on http://localhost:${port}`);
      console.log("\nAvailable routes:");
      console.log("- POST /user/signup - Create new user account");
      console.log("- POST /user/login - User login");
    });
  })
  .catch((err) => {
    console.error("\n❌ MongoDB connection error:");
    console.error("→ Error name:", err.name);
    console.error("→ Error message:", err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error("\nTroubleshooting steps:");
      console.error("1. Check MongoDB Atlas credentials");
      console.error("2. Verify network connectivity");
      console.error("3. Check IP whitelist in MongoDB Atlas");
      console.error("\nConnection details:");
      console.error("→ URI:", mongoURI);
      console.error("→ Database:", 'futsal-booking');
    }
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
