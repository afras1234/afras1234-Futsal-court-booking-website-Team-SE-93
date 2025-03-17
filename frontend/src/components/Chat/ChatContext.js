import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000";

// Create socket connection outside component to prevent reconnections
let socket;

// Try to initialize socket connection
const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false, // Start disconnected, we'll connect manually
    });
  }
  return socket;
};

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageTimes, setLastMessageTimes] = useState({});
  const [readMessageIds, setReadMessageIds] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const socketInitialized = useRef(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const navigate = useNavigate();

  // Format timestamp consistently
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleChat = (newState) => {
    console.log("ChatContext.toggleChat called with:", newState);
    const newIsOpen = typeof newState === "boolean" ? newState : !isOpen;
    console.log("Setting chat open state to:", newIsOpen);

    setIsOpen(newIsOpen);

    if (newIsOpen === true) {
      setTimeout(() => {
        const chatDrawers = document.querySelectorAll(".chat-drawer");
        chatDrawers.forEach((drawer) => {
          drawer.style.display = "block";
          drawer.style.visibility = "visible";
          drawer.style.opacity = "1";
        });

        const paperElements = document.querySelectorAll(".MuiDrawer-paper");
        paperElements.forEach((paper) => {
          paper.style.display = "block";
          paper.style.opacity = "1";
          paper.style.visibility = "visible";
        });
      }, 10);
    }
    else {
      setSelectedUser(null);

      setTimeout(() => {
        const chatDrawers = document.querySelectorAll(".chat-drawer");
        chatDrawers.forEach((drawer) => {
          drawer.style.display = "none";
        });

        const muiBackdrops = document.querySelectorAll(".MuiBackdrop-root");
        muiBackdrops.forEach((backdrop) => {
          backdrop.style.display = "none";
        });

        const paperElements = document.querySelectorAll(".MuiDrawer-paper");
        paperElements.forEach((paper) => {
          paper.style.display = "none";
        });
      }, 10);
    }
  };

  const handleClickOutside = (event) => {
    if (isOpen) {
      const chatContainer = document.querySelector(".chat-container");
      const chatFab = document.querySelector(".chat-toggle-button");

      if (
        chatContainer &&
        !chatContainer.contains(event.target) &&
        !chatFab?.contains(event.target)
      ) {
        console.log("Context: detected click outside chat");
        toggleChat(false);
      }
    }
  };

  useEffect(() => {
    const handleCustomCloseEvent = () => {
      console.log("Custom close event received");
      setIsOpen(false);
    };

    document.addEventListener("closeChatRequested", handleCustomCloseEvent);

    return () => {
      document.removeEventListener(
        "closeChatRequested",
        handleCustomCloseEvent
      );
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || isSending) return;

    const messageData = {
      sender: currentUser,
      receiver: selectedUser,
      text: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    try {
      setIsSending(true);
      const tempId = `temp-${Date.now()}`;
      const tempMessage = { ...messageData, _id: tempId, pending: true };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      setLastMessageTimes((prev) => ({
        ...prev,
        [selectedUser]: messageData.timestamp,
      }));

      socket.emit("privateMessage", messageData, (acknowledgement) => {
        if (acknowledgement && acknowledgement.error) {
          setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
          setError("Failed to send message. Please try again.");
          return;
        }

        if (acknowledgement && acknowledgement.message) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId
                ? { ...acknowledgement.message, pending: false }
                : msg
            )
          );
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socketInstance = initializeSocket();

    if (!socketInitialized.current) {
      socketInstance.connect();

      socketInstance.on("connect", () => {
        console.log(
          "Connected to chat server with socket ID:",
          socketInstance.id
        );
        socketInstance.emit("userConnected", { userId });
      });

      socketInstance.on("onlineUsers", (userIds) => {
        console.log("Received online users:", userIds);
        setOnlineUsers(new Set(userIds));
      });

      socketInstance.on("onlineUsersUpdate", (userIds) => {
        console.log("Received updated online users list:", userIds);
        setOnlineUsers(new Set(userIds));
      });

      socketInstance.on("userStatusChanged", ({ userId, isOnline }) => {
        console.log("User status changed:", userId, isOnline);
        setOnlineUsers((prev) => {
          const updated = new Set([...prev]);
          if (isOnline) {
            updated.add(userId);
          } else {
            updated.delete(userId);
          }
          return updated;
        });
      });

      socketInstance.on("privateMessage", (msg) => {
        console.log("Received private message:", msg);
        const isCurrentChat =
          selectedUser === msg.sender || selectedUser === msg.receiver;
        const isMine = msg.sender === userId;

        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;

          const isNewMessageRead = isCurrentChat && isOpen && !isMine;

          if (isNewMessageRead && msg._id) {
            setReadMessageIds((prev) => new Set([...prev, msg._id]));
            socketInstance.emit("markAsRead", { messageIds: [msg._id] });
          }

          return [
            ...prev,
            {
              ...msg,
              timestamp: msg.timestamp || new Date(),
              isRead: isNewMessageRead,
            },
          ];
        });

        setLastMessageTimes((prev) => {
          const otherUser = isMine ? msg.receiver : msg.sender;
          return {
            ...prev,
            [otherUser]: msg.timestamp || new Date(),
          };
        });

        if (!isOpen || (!isCurrentChat && !isMine)) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socketInstance.on("messageRead", ({ messageIds }) => {
        console.log("Messages marked as read:", messageIds);

        setReadMessageIds((prev) => {
          const updated = new Set([...prev]);
          messageIds.forEach((id) => updated.add(id));
          return updated;
        });

        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
          )
        );
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError("Connection to chat server failed. Please refresh the page.");
      });

      socketInstance.on("reconnect", () => {
        console.log("Socket reconnected - re-registering user");
        socketInstance.emit("userConnected", { userId });
      });

      socketInitialized.current = true;
    }

    if (isOpen && socketInstance.connected) {
      socketInstance.emit("userConnected", { userId });
    }
  }, [isOpen, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/auth");
          return;
        }

        const userId = localStorage.getItem("userId");
        setCurrentUser(userId);

        const userResponse = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data) {
          const userData = Array.isArray(userResponse.data)
            ? userResponse.data
            : userResponse.data.users || [];

          const filteredUsers = userData.filter(
            (user) => user && (user.id || user._id) !== userId
          );

          setUsers(filteredUsers);
        } else {
          console.error(
            "Invalid user data format received:",
            userResponse.data
          );
          setUsers([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [navigate, isOpen]);

  useEffect(() => {
    if (!selectedUser || !currentUser || !isOpen) return;

    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/chat/${currentUser}/${selectedUser}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const readMessages = new Set(
          res.data
            .filter((msg) => msg.isRead)
            .map((msg) => msg._id)
            .filter(Boolean)
        );

        setReadMessageIds((prev) => new Set([...prev, ...readMessages]));
        setMessages(res.data);

        if (res.data && res.data.length > 0) {
          const mostRecent = res.data.reduce((latest, msg) => {
            const msgTime = new Date(msg.timestamp);
            return msgTime > latest ? msgTime : latest;
          }, new Date(0));

          setLastMessageTimes((prev) => ({
            ...prev,
            [selectedUser]: mostRecent,
          }));
        }

        setIsLoading(false);

        const unreadMessages = res.data
          .filter((msg) => msg.sender === selectedUser && !msg.isRead)
          .map((msg) => msg._id)
          .filter(Boolean);

        if (unreadMessages.length > 0) {
          socket.emit("markAsRead", { messageIds: unreadMessages });
          setUnreadCount(0);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history");
        setIsLoading(false);
      }
    };

    fetchChatHistory();

    socket.emit("viewChat", { userId: currentUser, chatWithId: selectedUser });
  }, [selectedUser, currentUser, isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedUser || !messages.length) return;

    const unreadMessages = messages
      .filter(
        (msg) =>
          msg.sender === selectedUser &&
          !msg.isRead &&
          !readMessageIds.has(msg._id)
      )
      .map((msg) => msg._id)
      .filter(Boolean);

    if (unreadMessages.length > 0) {
      socket.emit("markAsRead", { messageIds: unreadMessages });

      setReadMessageIds((prev) => {
        const updated = new Set([...prev]);
        unreadMessages.forEach((id) => updated.add(id));
        return updated;
      });

      setMessages((prev) =>
        prev.map((msg) =>
          unreadMessages.includes(msg._id) ? { ...msg, isRead: true } : msg
        )
      );
    }
  }, [isOpen, selectedUser, messages, readMessageIds]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sortedUsers = [...users].sort((a, b) => {
    const userIdA = a.id || a._id;
    const userIdB = b.id || b._id;

    const timeA = lastMessageTimes[userIdA]
      ? new Date(lastMessageTimes[userIdA])
      : new Date(0);
    const timeB = lastMessageTimes[userIdB]
      ? new Date(lastMessageTimes[userIdB])
      : new Date(0);

    return timeB - timeA; 
  });

  const value = {
    users,
    sortedUsers,
    onlineUsers,
    selectedUser,
    setSelectedUser,
    messages,
    newMessage,
    setNewMessage,
    currentUser,
    isLoading,
    isSending,
    error,
    setError,
    unreadCount,
    lastMessageTimes,
    readMessageIds,
    isOpen,
    toggleChat,
    sendMessage,
    formatTimestamp,
    messagesEndRef,
    chatContainerRef,
    handleClickOutside, 
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
