import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminSignup } from "../../api-helpers/api-helpers";
import { adminActions } from "../../store";
import { Box, Button, Dialog, FormLabel, IconButton, TextField, Typography, Alert } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const labelStyle = { mt: 1, mb: 1 };

const Admin = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    secretKey: "",
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
    if (!inputs.name || !inputs.email || !inputs.password || !inputs.phone || !inputs.secretKey) {
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

    // Password length validation
    if (inputs.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await adminSignup(inputs);
      if (res && res.token && res.id) {
        localStorage.setItem("adminId", res.id);
        localStorage.setItem("token", res.token);
        dispatch(adminActions.login());
        navigate("/admin-profile");
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Admin signup error:", err);
      setError(err.response?.data?.message || "Error during signup. Please try again.");
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
        Admin Signup
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

          <FormLabel sx={{ ...labelStyle, color: "white" }}>Name</FormLabel>
          <TextField
            value={inputs.name}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="text"
            name="name"
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
          <FormLabel sx={{ ...labelStyle, color: "white" }}>Phone</FormLabel>
          <TextField
            value={inputs.phone}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="text"
            name="phone"
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
          <FormLabel sx={{ ...labelStyle, color: "white" }}>Secret Key</FormLabel>
          <TextField
            value={inputs.secretKey}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="password"
            name="secretKey"
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
            sx={{ 
              mt: 2, 
              borderRadius: 10, 
              bgcolor: "#ff6700",
              color: "white",
              "&:hover": {
                bgcolor: "#ff8533",
              },
              "&:disabled": {
                bgcolor: "rgba(255, 103, 0, 0.5)",
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default Admin;
