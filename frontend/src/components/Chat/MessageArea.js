import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
  CircularProgress,
  Avatar,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatIcon from "@mui/icons-material/Chat";
import { useChatContext } from "./ChatContext";
import MessageBubble from "./MessageBubble";
import { MessageContainer } from "./StyledComponents";

const MessageArea = () => {
  const {
    users,
    selectedUser,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    sendMessage,
    messagesEndRef,
  } = useChatContext();
  const theme = useTheme();
  const messageContainerRef = useRef(null);

  const selectedUserName =
    users.find((u) => (u.id || u._id) === selectedUser)?.name ||
    users.find((u) => (u.id || u._id) === selectedUser)?.username ||
    "User";

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {
      const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (
          (scrollTop <= 0 && e.deltaY < 0) ||
          (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
        ) {
          return;
        }

        e.stopPropagation();
      };

      container.addEventListener("wheel", handleScroll);

      return () => {
        container.removeEventListener("wheel", handleScroll);
      };
    }
  }, []);

  return (
    <Box
      width="60%"
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="background.paper"
      className="message-area-container"
    >
      {selectedUser ? (
        <>
          <Box
            p={2}
            borderBottom={1}
            borderColor="divider"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {selectedUserName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="600">
                {selectedUserName}
              </Typography>
            </Box>
            <Tooltip title="Options" arrow>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <MessageContainer ref={messageContainerRef}>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                flexDirection="column"
              >
                <CircularProgress size={30} thickness={4} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Loading messages...
                </Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                flexDirection="column"
                sx={{ p: 3, textAlign: "center" }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    mb: 2,
                  }}
                >
                  <ChatIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  color="text.primary"
                  variant="body1"
                  fontWeight="medium"
                  gutterBottom
                >
                  No messages yet
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Start a conversation with {selectedUserName}
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <MessageBubble key={msg._id || idx} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </MessageContainer>

          <Box
            p={1.5}
            borderTop={1}
            borderColor="divider"
            sx={{
              backgroundColor: alpha(theme.palette.background.default, 0.4),
              position: "sticky",
              bottom: 0,
              zIndex: 5,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              disabled={isSending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: theme.palette.background.paper,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={isSending ? "Sending..." : "Send message"}
                      arrow
                    >
                      <span>
                        <IconButton
                          color="primary"
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isSending}
                          edge="end"
                          sx={{
                            borderRadius: "50%",
                            bgcolor:
                              newMessage.trim() && !isSending
                                ? "primary.main"
                                : "transparent",
                            color:
                              newMessage.trim() && !isSending
                                ? "white"
                                : "inherit",
                            "&:hover": {
                              bgcolor:
                                newMessage.trim() && !isSending
                                  ? "primary.dark"
                                  : undefined,
                            },
                          }}
                        >
                          {isSending ? (
                            <CircularProgress
                              size={20}
                              thickness={5}
                              color="inherit"
                            />
                          ) : (
                            <SendIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          flexDirection="column"
          p={4}
          sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 3,
            }}
          >
            <ChatIcon color="primary" sx={{ fontSize: 50 }} />
          </Box>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Your Messages
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ maxWidth: "80%", mx: "auto" }}
          >
            Select a conversation from the list to start chatting
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageArea;
