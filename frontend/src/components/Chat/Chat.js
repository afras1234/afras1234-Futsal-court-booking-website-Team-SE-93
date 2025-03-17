import React, { useEffect, useRef } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChatDrawer, HeaderBox } from "./StyledComponents";
import { useChatContext } from "./ChatContext";
import UserList from "./UserList";
import MessageArea from "./MessageArea";
import ChatFab from "./ChatFab";
import ErrorDisplay from "./ErrorDisplay";

const Chat = ({ isOpen: externalIsOpen, toggleChat: externalToggleChat }) => {
  const { isOpen, toggleChat, error } = useChatContext();
  const chatContainerRef = useRef(null);
  const theme = useTheme();

    useEffect(() => {
    if (externalIsOpen !== undefined && externalIsOpen !== isOpen) {
      toggleChat(externalIsOpen);
    }
  }, [externalIsOpen]);

    const handleToggle = (newState) => {
    if (externalToggleChat) {
      externalToggleChat(newState);
    } else {
      toggleChat(newState);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target) &&
        !event.target.closest(".chat-toggle-button")
      ) {
        handleToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    const preventBodyScroll = (e) => {
      if (chatContainerRef.current?.contains(e.target)) {
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener("wheel", preventBodyScroll, { passive: false });
      document.addEventListener("touchmove", preventBodyScroll, {
        passive: false,
      });
    }

    return () => {
      document.removeEventListener("wheel", preventBodyScroll);
      document.removeEventListener("touchmove", preventBodyScroll);
    };
  }, [isOpen]);

  if (!isOpen) {
    return <ChatFab />;
  }

  if (error) {
    return (
      <ChatDrawer
        anchor="right"
        open={isOpen}
        onClose={() => handleToggle(false)}
        variant="permanent"
      >
        <Box position="relative">
          <IconButton
            onClick={() => handleToggle(false)}
            size="medium"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1200,
              backgroundColor: theme.palette.grey[300],
              "&:hover": {
                backgroundColor: theme.palette.grey[400],
              },
              borderRadius: "8px",
            }}
            aria-label="close chat"
          >
            <CloseIcon />
          </IconButton>
          <ErrorDisplay onClose={() => handleToggle(false)} />
        </Box>
      </ChatDrawer>
    );
  }

  return (
    <ChatDrawer
      anchor="right"
      open={isOpen}
      onClose={() => handleToggle(false)}
      variant="permanent"
      className="chat-drawer"
    >
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        ref={chatContainerRef}
        className="chat-container"
        sx={{ overflow: "hidden" }}
      >
        <HeaderBox>
          <Typography variant="h6" fontWeight="600">
            Messages
          </Typography>
        </HeaderBox>

        <Box
          display="flex"
          flexDirection="row"
          height="calc(100% - 56px)"
          sx={{ overflow: "hidden" }}
        >
          <UserList />
          <MessageArea />
        </Box>
      </Box>
    </ChatDrawer>
  );
};

export default Chat;
