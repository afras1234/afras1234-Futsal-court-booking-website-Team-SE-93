import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers";
import { adminActions } from "../../store";
import { Box, Button, Dialog, FormLabel, IconButton, TextField, Typography, Alert } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const labelStyle = { mt: 1, mb: 1 };

const AdminLogin = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Client-side validation
    if (!inputs.email || !inputs.password) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      setError("Invalid email format");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await sendAdminAuthRequest(inputs);
      if (res && res.token && res.id) {
        localStorage.setItem("adminId", res.id);
        localStorage.setItem("token", res.token);
        dispatch(adminActions.login());
        navigate("/admin-profile");
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Error during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
    PaperProps={{
      style: {
        borderRadius: 20,
        background: 'rgba(255, 255, 255, 0.1)',  // semi-transparent white for glass effect
        color: 'white',
        backdropFilter: 'blur(10px)',  // applies blur to the background behind the dialog
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // subtle shadow for depth
      },
    }}
      open={true}
    >
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: "white" }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" textAlign="center" sx={{ color: "white", mb: 3 }}>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          padding={6}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width={400}
          margin="auto"
          alignContent="center"
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormLabel sx={{ ...labelStyle, color: "white" }}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="email"
            name="email"
            required
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
                "&:before": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&:hover:not(.Mui-disabled):before": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
            }}
          />
          <FormLabel sx={{ ...labelStyle, color: "white" }}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="password"
            name="password"
            required
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
                "&:before": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&:hover:not(.Mui-disabled):before": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#ff6700",
              color: "white",
              "&:hover": {
                bgcolor: "#ff8533",
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Link to="/admin/signup" style={{ textDecoration: 'none' }}>
              <Button
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  color: "white",
                  border: "1px solid white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Admin Signup
              </Button>
            </Link>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: "white",
                  border: "1px solid white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
};

export default AdminLogin;
