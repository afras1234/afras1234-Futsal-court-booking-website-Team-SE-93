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
import React, { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AuthForm = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // Add phone field
  });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get mode from URL parameters
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setIsSignup(mode === "signup");
    setError(""); // Clear error when switching modes
  }, [location]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Validate inputs
      if (isSignup) {
        if (!inputs.name) {
          setError("Name is required");
          return;
        }
        if (!inputs.phone) {
          setError("Phone number is required");
          return;
        }
      }
      if (!inputs.email) {
        setError("Email is required");
        return;
      }
      if (!inputs.password) {
        setError("Password is required");
        return;
      }

      await onSubmit({ inputs, signup: isAdmin ? false : isSignup });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during authentication");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const toggleMode = () => {
    const newMode = isSignup ? "login" : "signup";
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          background: "linear-gradient(135deg, #061a40, #ff6700)",
          color: "white",
        },
      }}
      open={true}
    >
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton component={Link} to="/" sx={{ color: "white" }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        {isSignup ? "Create Account" : "Welcome Back"}
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
            justifyContent: "center",
            width: 400,
            margin: "auto",
          }}
        >
          {!isAdmin && isSignup && (
            <>
              <FormLabel sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type="text"
                name="name"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                  padding: "10px",
                  color: "white",
                }}
                InputProps={{ sx: { color: "white" } }}
              />
              <FormLabel sx={{ color: "white", fontWeight: "bold" }}>
                Phone
              </FormLabel>
              <TextField
                value={inputs.phone}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type="tel"
                name="phone"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                  padding: "10px",
                  color: "white",
                }}
                InputProps={{ sx: { color: "white" } }}
              />
            </>
          )}
          <FormLabel sx={{ color: "white", fontWeight: "bold" }}>
            Email
          </FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="email"
            name="email"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: 1,
              padding: "10px",
              color: "white",
            }}
            InputProps={{ sx: { color: "white" } }}
          />
          <FormLabel sx={{ color: "white", fontWeight: "bold" }}>
            Password
          </FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="password"
            name="password"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: 1,
              padding: "10px",
              color: "white",
            }}
            InputProps={{ sx: { color: "white" } }}
          />
          <Button
            type="submit"
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "#ff6700",
              "&:hover": { backgroundColor: "#ff4500" },
              color: "white",
              width: "100%",
            }}
          >
            {isSignup ? "Create Account" : "Login"}
          </Button>
          <Button
            onClick={toggleMode}
            sx={{
              mt: 2,
              color: "white",
              textDecoration: "underline",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Button>
          {!isSignup && (
            <Button
              onClick={handleForgotPassword}
              sx={{
                mt: 1,
                color: "white",
                textDecoration: "underline",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Forgot Password?
            </Button>
          )}
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
