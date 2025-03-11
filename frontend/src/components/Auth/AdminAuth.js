import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLogin, adminSignup } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { adminActions } from "../../store/admin-slice";

const AdminAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    secretKey: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setIsSignup(mode === "signup");
    setError("");
  }, [location]);

  const onClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const onRequestSent = (val) => {
    localStorage.removeItem("userId");
    localStorage.setItem("adminId", val.id);
    localStorage.setItem("token", val.token);
    dispatch(adminActions.login());
    setOpen(false);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        if (!inputs.name) {
          setError("Name is required");
          return;
        }
        if (!inputs.phone) {
          setError("Phone number is required");
          return;
        }
        if (inputs.secretKey !== "12345") {
          setError("Invalid secret key");
          return;
        }
        if (!inputs.email) {
          setError("Email is required");
          return;
        }
        if (!inputs.password) {
          setError("Password is required");
          return;
        }
        
        const data = await adminSignup(inputs);
        onRequestSent(data);
      } else {
        if (!inputs.email || !inputs.password) {
          setError("Email and password are required");
          return;
        }
        const data = await adminLogin(inputs);
        onRequestSent(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during authentication");
    }
  };

  const toggleMode = () => {
    const newMode = isSignup ? "login" : "signup";
    navigate(`/admin/auth?mode=${newMode}`);
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
      open={open}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          mb: 3,
          textTransform: "uppercase",
        }}
      >
        Admin {isSignup ? "Sign Up" : "Login"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {isSignup && (
            <>
              <FormLabel sx={{ color: "white", fontWeight: "bold" }}>Name</FormLabel>
              <TextField
                onChange={handleChange}
                value={inputs.name}
                name="name"
                type="text"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  input: { color: "white" },
                }}
              />
              <FormLabel sx={{ color: "white", fontWeight: "bold" }}>Phone</FormLabel>
              <TextField
                onChange={handleChange}
                value={inputs.phone}
                name="phone"
                type="tel"
                variant="outlined"
                fullWidth
                placeholder="Enter Phone Number"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  input: { color: "white" },
                }}
              />
              <FormLabel sx={{ color: "white", fontWeight: "bold" }}>Secret Key</FormLabel>
              <TextField
                onChange={handleChange}
                value={inputs.secretKey}
                name="secretKey"
                type="password"
                variant="outlined"
                fullWidth
                placeholder="Enter Secret Key"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  input: { color: "white" },
                }}
              />
            </>
          )}
          <FormLabel sx={{ color: "white", fontWeight: "bold" }}>Email</FormLabel>
          <TextField
            onChange={handleChange}
            value={inputs.email}
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            placeholder="Enter Email"
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              input: { color: "white" },
            }}
          />
          <FormLabel sx={{ color: "white", fontWeight: "bold" }}>Password</FormLabel>
          <TextField
            onChange={handleChange}
            value={inputs.password}
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Enter Password"
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              input: { color: "white" },
            }}
          />
          <Button
            sx={{
              borderRadius: 10,
              mt: 2,
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "#FF4500",
              "&:hover": { backgroundColor: "#E63900" },
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
          <Button
            onClick={toggleMode}
            sx={{ color: "white", textTransform: "none" }}
          >
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AdminAuth;
