import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import futsalCourtRouter from "./routes/futsalCourt-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import tournamentRouter from "./routes/tournaments.js";
import chatRoutes from "./routes/chat-routes.js";
import { saveMessage } from "./controllers/chat-controller.js";

dotenv.config();

const app = express();
const server = createServer(app); 

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "https://your-production-domain.com", // Add your production domain
      // Add any other domains that need access
    ];

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Also update Socket.io CORS settings
const io = new Server(server, {
  cors: corsOptions,
});

app.use(express.json());

// CORS preflight options for complex requests
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/futsalCourt", futsalCourtRouter);
app.use("/booking", bookingsRouter);
app.use("/tournaments", tournamentRouter);
app.use("/chat", chatRoutes);

// Track connected users with their socket IDs
const onlineUsers = new Map(); // userId -> socketId
const userSockets = new Map(); // socketId -> userId

// Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // User connects and registers their ID
  socket.on("userConnected", ({ userId }) => {
    if (!userId) return;

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    // Store user as online
    onlineUsers.set(userId, socket.id);
    userSockets.set(socket.id, userId);

    // Join a room with their userId to enable direct messaging
    socket.join(userId);

    // Broadcast online status to all clients
    io.emit("userStatusChanged", { userId, isOnline: true });

    // Send the list of online users to the newly connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit("onlineUsers", onlineUsersList);
  });

  // Handle private messages
  socket.on("privateMessage", async (messageData, callback) => {
    const { sender, receiver, text, timestamp } = messageData;

    console.log("📩 New private message:", { sender, receiver, text });

    try {
      const savedMessage = await saveMessage(sender, receiver, text, timestamp);

      // Send to receiver
      io.to(receiver).emit("privateMessage", savedMessage);

      // Send confirmation back to sender (different than sending to the sender's room)
      if (callback) {
        callback({ success: true, message: savedMessage });
      }
    } catch (error) {
      console.error("Error saving/sending message:", error);
      if (callback) {
        callback({ error: "Failed to send message" });
      }
    }
  });

  // Mark messages as read
  socket.on("markAsRead", ({ messageIds }) => {
    const userId = userSockets.get(socket.id);
    if (userId && messageIds && messageIds.length) {
      // Broadcast to all devices of the sender that messages were read
      io.emit("messageRead", { messageIds });
    }
  });

  // Handle user viewing a specific chat
  socket.on("viewChat", ({ userId, chatWithId }) => {
    console.log(`User ${userId} is viewing chat with ${chatWithId}`);
    // Could be used for "user is typing" or other features
  });

  socket.on("disconnect", () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      console.log(`❌ User ${userId} disconnected`);
      // Remove user from tracking
      onlineUsers.delete(userId);
      userSockets.delete(socket.id);

      // Broadcast offline status
      io.emit("userStatusChanged", { userId, isOnline: false });
    } else {
      console.log("❌ A user disconnected (not logged in)");
    }
  });
});

// Connect to MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://new_user_31:${process.env.MONGODB_PASSWORD}@moviewebsite12.ynvss.mongodb.net/futsal-court?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Interval to broadcast online users every 30 seconds to ensure consistency
    setInterval(() => {
      const onlineUsersList = Array.from(onlineUsers.keys());
      if (onlineUsersList.length > 0) {
        io.emit("onlineUsersUpdate", onlineUsersList);
        console.log("Broadcasting online users:", onlineUsersList);
      }
    }, 30000);

    server.listen(5000, () => {
      console.log("🚀 Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
