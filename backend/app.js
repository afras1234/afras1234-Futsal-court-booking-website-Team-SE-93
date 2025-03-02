import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  // Remove require("cors")

import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import futsalCourtRouter from "./routes/futsalCourt-routes.js";
import bookingsRouter from "./routes/booking-routes.js";

dotenv.config();

const app = express();

// Middleware - Configure CORS properly
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend domain
    credentials: true, // Allow cookies, authentication headers, etc.
  })
);

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/futsalCourt", futsalCourtRouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(
    `mongodb+srv://new_user_31:${process.env.MONGODB_PASSWORD}@moviewebsite12.ynvss.mongodb.net/?retryWrites=true&w=majority&appName=MovieWebsite12`
  )
  .then(() => {
    app.listen(5000, () =>
      console.log("Connected To Database And Server is running on port 5000")
    );
  })
  .catch((e) => console.log(e));
