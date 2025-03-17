import React from "react";
import { Badge, Typography, Tooltip, Zoom } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatFab as StyledChatFab } from "./StyledComponents";
import { useChatContext } from "./ChatContext";

const ChatFab = () => {
  const { unreadCount, toggleChat } = useChatContext();

  const handleOpenChat = (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("ChatFab: Opening chat");

    toggleChat(true);

    setTimeout(() => {
      const chatDrawers = document.querySelectorAll(".chat-drawer");
      chatDrawers.forEach((drawer) => {
        drawer.style.display = "block";
        drawer.style.opacity = "1";
        drawer.style.visibility = "visible";
      });

      const paperElements = document.querySelectorAll(".MuiDrawer-paper");
      paperElements.forEach((paper) => {
        paper.style.display = "block";
        paper.style.opacity = "1";
        paper.style.visibility = "visible";
      });
    }, 50);
  };

  return (
    <Tooltip title="Open chat" arrow TransitionComponent={Zoom}>
      <StyledChatFab
        color="primary"
        aria-label="chat"
        onClick={handleOpenChat}
        hasunread={unreadCount > 0 ? "true" : "false"}
        variant="extended"
        className="chat-toggle-button"
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.8rem",
              height: "20px",
              minWidth: "20px",
            },
            mr: 1,
          }}
        >
          <ChatIcon />
        </Badge>
        <Typography variant="button" component="span" sx={{ fontWeight: 500 }}>
          Chat with players
        </Typography>
      </StyledChatFab>
    </Tooltip>
  );
};

export default ChatFab;
