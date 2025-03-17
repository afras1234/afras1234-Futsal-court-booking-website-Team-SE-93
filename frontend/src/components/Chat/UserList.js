import React from "react";
import {
  List,
  Box,
  Typography,
  Avatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useChatContext } from "./ChatContext";
import {
  UserListContainer,
  StyledListItem,
  StyledBadge,
} from "./StyledComponents";

const UserList = () => {
  const {
    sortedUsers,
    onlineUsers,
    selectedUser,
    setSelectedUser,
    lastMessageTimes,
    formatTimestamp,
    isLoading,
  } = useChatContext();

  if (isLoading && !selectedUser) {
    return (
      <UserListContainer width="40%">
        <Box
          px={2}
          py={1.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2" fontWeight="600" color="primary">
            Conversations
          </Typography>
          <Tooltip title="Options" arrow>
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box display="flex" justifyContent="center" p={4} height="80%">
          <CircularProgress size={28} color="primary" />
        </Box>
      </UserListContainer>
    );
  }

  return (
    <UserListContainer width="40%">
      <Box
        px={2}
        py={1.5}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="subtitle2" fontWeight="600" color="primary">
          Conversations
        </Typography>
        <Tooltip title="Options" arrow>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          height: "calc(100% - 60px)",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <List disablePadding sx={{ pt: 0.5, pb: 1 }}>
          {sortedUsers.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" variant="body2">
                No users available
              </Typography>
            </Box>
          ) : (
            sortedUsers.map((user) => {
              const userId = user.id || user._id;
              const isSelected = selectedUser === userId;
              const userOnline = onlineUsers.has(userId);
              const lastMessageTime = lastMessageTimes[userId];

              return (
                <StyledListItem
                  key={userId}
                  button
                  selected={isSelected}
                  onClick={() => setSelectedUser(userId)}
                  sx={{ py: 1 }}
                >
                  <Box sx={{ minWidth: 45 }}>
                    {userOnline ? (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar
                          sx={{
                            bgcolor: isSelected ? "primary.main" : "grey.400",
                            color: "white",
                            width: 38,
                            height: 38,
                            fontWeight: "bold",
                          }}
                        >
                          {(user.name || user.username || "")
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar>
                      </StyledBadge>
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? "primary.main" : "grey.400",
                          color: "white",
                          width: 38,
                          height: 38,
                          fontWeight: "bold",
                        }}
                      >
                        {(user.name || user.username || "")
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                  <ListItemText
                    primary={user.name || user.username}
                    secondary={
                      lastMessageTime
                        ? `${formatTimestamp(lastMessageTime)}`
                        : userOnline
                        ? "Online"
                        : "Offline"
                    }
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: isSelected ? "600" : "400",
                      fontSize: "0.95rem",
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.75rem",
                      color:
                        userOnline && !lastMessageTime
                          ? "success.main"
                          : "text.secondary",
                    }}
                    sx={{ ml: 2 }}
                  />
                </StyledListItem>
              );
            })
          )}
        </List>
      </Box>
    </UserListContainer>
  );
};

export default UserList;
