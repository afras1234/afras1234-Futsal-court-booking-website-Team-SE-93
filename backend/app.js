import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/user-routes.js';
import adminRouter from './routes/admin-routes.js';
import futsalCourtRouter from './routes/futsalCourt-routes.js';
import bookingsRouter from './routes/booking-routes.js';
import tournamentRouter from './routes/tournaments.js';

dotenv.config();

const app = express();

// Set strictQuery option
mongoose.set('strictQuery', true);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/futsalCourt', futsalCourtRouter);
app.use('/booking', bookingsRouter);
app.use('/tournaments', tournamentRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to Futsal Court Booking API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `A record with this ${field} already exists.`
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB Atlas
mongoose.connect(
  `mongodb+srv://new_user_31:${process.env.MONGODB_PASSWORD}@moviewebsite12.ynvss.mongodb.net/futsal-court?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
  console.log('Connected to MongoDB Atlas successfully');
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
