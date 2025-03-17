import React from "react";
import { Box, Typography, Button, alpha, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { HeaderBox } from "./StyledComponents";
import { useChatContext } from "./ChatContext";

const ErrorDisplay = ({ onClose }) => {
  const { error, setError } = useChatContext();
  const theme = alpha;

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <HeaderBox>
        <Typography variant="h6" fontWeight="medium">
          Chat
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ borderRadius: "8px" }}>
          <CloseIcon />
        </IconButton>
      </HeaderBox>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          backgroundColor: alpha(theme.palette?.error.light, 0.1),
          borderRadius: 1,
        }}
      >
        <Typography
          color="error.main"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setError(null)}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorDisplay;
