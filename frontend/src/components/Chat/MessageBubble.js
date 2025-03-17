import React from "react";
import { Typography, Box, CircularProgress, useTheme } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { MessageBubble as StyledMessageBubble } from "./StyledComponents";
import { useChatContext } from "./ChatContext";

const MessageBubble = ({ message }) => {
  const { currentUser, readMessageIds, formatTimestamp } = useChatContext();
  const theme = useTheme();

  const isSent = message.sender === currentUser;

  return (
    <StyledMessageBubble
      variant={isSent ? "sent" : "received"}
      pending={message.pending}
    >
      <Typography
        variant="body2"
        sx={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.text}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: "flex",
          fontSize: "0.7rem",
          opacity: 0.8,
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 0.5,
        }}
      >
        {formatTimestamp(message.timestamp)}
        {isSent && (
          <Box ml={0.5} display="inline-flex" alignItems="center">
            {message.pending ? (
              <CircularProgress size={8} thickness={8} sx={{ ml: 0.5 }} />
            ) : message.isRead || readMessageIds.has(message._id) ? (
              <DoneAllIcon
                sx={{
                  fontSize: 12,
                  ml: 0.5,
                  color: theme.palette.primary.main,
                }}
              />
            ) : (
              <DoneIcon sx={{ fontSize: 12, ml: 0.5 }} />
            )}
          </Box>
        )}
      </Typography>
    </StyledMessageBubble>
  );
};

export default MessageBubble;
