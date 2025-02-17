import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link, useNavigate } from "react-router-dom";

const AuthForm = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  console.log("onSubmit prop:", onSubmit); // Debugging

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onSubmit !== "function") {
      console.error("Error: onSubmit function is missing!");
      return;
    }

    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "#ff6700",
              "&:hover": { backgroundColor: "#ff4500" },
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
          {!isAdmin && (
            <Button
              onClick={() => setIsSignup(!isSignup)}
              sx={{
                mt: 2,
                borderRadius: 2,
                fontWeight: "bold",
                color: "white",
                textDecoration: "underline",
              }}
              fullWidth
            >
              Switch to {isSignup ? "Login" : "Sign Up"}
            </Button>
          )}
          <Button
            onClick={handleForgotPassword}
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: "bold",
              color: "#ffcc00",
              textTransform: "uppercase",
            }}
            fullWidth
          >
            Forgot Password?
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
