import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { resetPassword } from "../../api-helpers/api-helpers";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const { email } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword.trim()) {
        setMessage("Please enter a new password.");
        return;
        }

        try {
        const response = await resetPassword(email, newPassword);
        setMessage(response.message);
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
        } catch (error) {
        setMessage("Error resetting password.");
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
        <Typography variant="h4">Reset Password</Typography>
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
            <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Reset Password
            </Button>
        </form>
        {message && <Typography sx={{ mt: 2, color: "red" }}>{message}</Typography>}
        </Box>
    );
};

export default ResetPassword;
