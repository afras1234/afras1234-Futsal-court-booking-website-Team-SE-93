import Message from "../models/Message.js";

export const saveMessage = async (
  sender,
  receiver,
  text,
  timestamp = new Date()
) => {
  try {
    const message = new Message({
      sender,
      receiver,
      text,
      timestamp,
      isRead: false,
    });

    const savedMessage = await message.save();
    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); 

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting chat history:", error);
    res.status(500).json({ message: "Failed to get chat history" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: "Invalid message IDs" });
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};
