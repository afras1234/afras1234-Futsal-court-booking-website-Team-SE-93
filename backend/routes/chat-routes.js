import express from "express";
import {
  getChatHistory,
  markMessagesAsRead,
} from "../controllers/chat-controller.js";

const router = express.Router();

router.get("/:userId/:receiverId", getChatHistory);

router.post("/read", markMessagesAsRead);

export default router;
