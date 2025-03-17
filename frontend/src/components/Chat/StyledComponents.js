import { Box, Badge, Drawer, Paper, Fab, ListItem, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

// Styled components
export const ChatDrawer = styled(Drawer)(({ theme }) => ({
  display: "block !important",
  visibility: "visible !important",
  "& .MuiDrawer-paper": {
    width: 420,
    height: 580,
    bottom: 90,
    right: 30,
    left: "auto",
    top: "auto",
    position: "fixed",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
    animation: `${fadeIn} 0.3s ease-out`,
    overflow: "hidden",
    display: "block !important",
    visibility: "visible !important",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "transparent", // Make backdrop clickable but invisible
  },
}));

export const ChatFab = styled(Fab)(({ theme, hasunread }) => ({
  position: "fixed",
  bottom: 25,
  right: 25,
  boxShadow: theme.shadows[6],
  transition: "all 0.3s ease",
  animation: hasunread === "true" ? `${pulse} 1.5s infinite` : "none",
  padding: "0 20px",
  borderRadius: "30px",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MessageBubble = styled(Paper)(({ theme, variant, pending }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "75%",
  margin: theme.spacing(0.5, 0),
  backgroundColor:
    variant === "sent"
      ? theme.palette.primary.main
      : alpha(theme.palette.background.paper, 0.8),
  color:
    variant === "sent"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
  alignSelf: variant === "sent" ? "flex-end" : "flex-start",
  borderRadius:
    variant === "sent" ? theme.spacing(2, 2, 0, 2) : theme.spacing(2, 2, 2, 0),
  position: "relative",
  opacity: pending ? 0.7 : 1,
  boxShadow:
    variant === "sent"
      ? `0 1px 2px ${alpha(theme.palette.common.black, 0.2)}`
      : `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
  animation: `${fadeIn} 0.2s ease-out`,
  "&:hover": {
    boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: 0,
    height: 0,
    border: "8px solid transparent",
    bottom: 0,
    [variant === "sent" ? "right" : "left"]: -8,
    borderBottomColor:
      variant === "sent"
        ? theme.palette.primary.main
        : alpha(theme.palette.background.paper, 0.8),
  },
}));

export const MessageContainer = styled(Box)(({ theme }) => ({
  height: "340px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
  },
  // Enhanced to prevent scroll issues
  msOverflowStyle: "none", // IE and Edge
  scrollbarWidth: "thin", // Firefox
}));

export const UserListContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "3px",
  },
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(0.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  transition: "all 0.2s",
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  width: "auto",
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  paddingRight: theme.spacing(1.5), // Ensure enough space for the close button
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  top: 0,
  zIndex: 10,
  width: "100%",
  boxSizing: "border-box", // Ensure padding is included in width calculation
}));
