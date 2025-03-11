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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const labelStyle = { mt: 1, mb: 1 };

const AuthForm = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    secretKey: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setIsSignup(mode === "signup");
    setError("");
    // Clear inputs when switching modes
    setInputs({
      name: "",
      email: "",
      password: "",
      phone: "",
      secretKey: "",
    });
  }, [location]);

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

    try {
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

      // Validate inputs for signup
      if (isSignup) {
        if (!inputs.name) {
          setError("Name is required");
          setIsSubmitting(false);
          return;
        }
        if (!inputs.phone) {
          setError("Phone number is required");
          setIsSubmitting(false);
          return;
        }
      }

      // Basic validation for login
      if (!inputs.email || !inputs.password) {
        setError("Email and password are required");
        setIsSubmitting(false);
        return;
      }

      await onSubmit({ inputs, signup: isSignup, isAdmin: isAdminLogin });
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.message || "An error occurred during authentication");
    } finally {
      setIsSubmitting(false);
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
        style: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.1)',  // semi-transparent white for glass effect
          color: 'white',
          backdropFilter: 'blur(10px)',  // applies blur to the background behind the dialog
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // subtle shadow for depth
          padding: '24px'
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
        {isSignup ? "Create Account" : isAdminLogin ? "Admin Login" : "Welcome Back"}
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
          {isSignup && (
            <>
              <FormLabel sx={{ ...labelStyle, color: 'white' }}>Name</FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type="text"
                name="name"
                required
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  padding: "10px",
                  color: "white",
                  '& .MuiInput-underline:before': {
                    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
                InputProps={{ 
                  sx: { 
                    color: "white",
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  } 
                }}
              />
              <FormLabel sx={{ ...labelStyle, color: 'white' }}>Phone</FormLabel>
              <TextField
                value={inputs.phone}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type="tel"
                name="phone"
                required
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  padding: "10px",
                  color: "white",
                  '& .MuiInput-underline:before': {
                    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
                InputProps={{ 
                  sx: { 
                    color: "white",
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  } 
                }}
              />
            </>
          )}
          <FormLabel sx={{ ...labelStyle, color: 'white' }}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="email"
            name="email"
            required
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              padding: "10px",
              color: "white",
              '& .MuiInput-underline:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            InputProps={{ 
              sx: { 
                color: "white",
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              } 
            }}
          />
          <FormLabel sx={{ ...labelStyle, color: 'white' }}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type="password"
            name="password"
            required
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              padding: "10px",
              color: "white",
              '& .MuiInput-underline:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            InputProps={{ 
              sx: { 
                color: "white",
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              } 
            }}
          />

          <Box sx={{ mt: 2, width: "100%" }}>
            <Button
              type="submit"
              fullWidth
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
              {isSubmitting ? "Please wait..." : (isSignup ? "Create Account" : isAdminLogin ? "Admin Login" : "Login")}
            </Button>
            {!isAdminLogin && (
              <Button
                onClick={toggleMode}
                sx={{
                  mt: 2,
                  color: "white",
                  textDecoration: "underline",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
            {!isSignup && (
              <Button
                onClick={() => setIsAdminLogin(!isAdminLogin)}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  mt: 2,
                  color: "white",
                  textDecoration: "underline",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {isAdminLogin ? "Switch to User Login" : "Switch to Admin Login"}
              </Button>
            )}
            
            {isAdminLogin && (
              <Link to="/admin/signup" style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    mt: 2,
                    color: "white",
                    textDecoration: "underline",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Create Admin Account
                </Button>
              </Link>
            )}

            {!isAdminLogin && !isSignup && (
              <Button
                onClick={handleForgotPassword}
                sx={{
                  mt: 2,
                  color: "white",
                  textDecoration: "underline",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Forgot Password?
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
