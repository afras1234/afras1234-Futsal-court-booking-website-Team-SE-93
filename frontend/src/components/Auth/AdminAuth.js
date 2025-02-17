import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { adminActions } from "../../store/admin-slice";

const AdminAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const onClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRequestSent = (val) => {
    localStorage.removeItem("userId");
    localStorage.setItem("adminId", val.id);
    localStorage.setItem("token", val.token);
    dispatch(adminActions.login());
    setOpen(false);
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    adminLogin(inputs)
      .then(onRequestSent)
      .catch((err) => console.log(err));
    setInputs({ name: "", email: "", password: "" });
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          background: "linear-gradient(135deg, #0A192F, #FF4500)",
          color: "white",
          width: "420px",
          textAlign: "center",
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
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
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
            Login
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AdminAuth;
