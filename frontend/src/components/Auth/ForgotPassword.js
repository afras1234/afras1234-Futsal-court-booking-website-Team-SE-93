import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { requestPasswordReset } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
        setMessage("Please enter your email.");
        return;
        }

        try {
        const response = await requestPasswordReset(email);
        setMessage(response.message);
        setTimeout(() => navigate("/reset-password"), 3000); // Redirect after 3s
        } catch (error) {
        setMessage("Error requesting password reset.");
        }
    };

    return (
        <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        >
        <Typography variant="h4">Forgot Password</Typography>
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
            <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Request Password Reset
            </Button>
        </form>
        {message && <Typography sx={{ mt: 2, color: "red" }}>{message}</Typography>}
        </Box>
    );
};

export default ForgotPassword;