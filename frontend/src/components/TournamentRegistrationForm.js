import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';

const TournamentRegistrationForm = ({ open, onClose, tournament, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainPhone: '',
    playerCount: '',
    paymentReference: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.captainName.trim()) newErrors.captainName = 'Captain name is required';
    if (!formData.captainPhone.trim()) newErrors.captainPhone = 'Captain phone is required';
    if (!formData.playerCount || formData.playerCount < 5) newErrors.playerCount = 'Minimum 5 players required';
    if (!formData.paymentReference.trim()) newErrors.paymentReference = 'Payment reference is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/tournaments/${tournament._id}/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setFormData({
        teamName: '',
        captainName: '',
        captainPhone: '',
        playerCount: '',
        paymentReference: ''
      });
      onSuccess();
    } catch (error) {
      onError(error.response?.data || { message: 'Failed to register for tournament' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Tournament Registration - {tournament?.name}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Registration Fee: Rs. {tournament?.registrationFee?.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prize Pool: Rs. {tournament?.prizePool?.toLocaleString()}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                error={!!errors.teamName}
                helperText={errors.teamName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Captain Name"
                name="captainName"
                value={formData.captainName}
                onChange={handleChange}
                error={!!errors.captainName}
                helperText={errors.captainName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Captain Phone Number"
                name="captainPhone"
                value={formData.captainPhone}
                onChange={handleChange}
                error={!!errors.captainPhone}
                helperText={errors.captainPhone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Players"
                name="playerCount"
                type="number"
                value={formData.playerCount}
                onChange={handleChange}
                error={!!errors.playerCount}
                helperText={errors.playerCount || 'Minimum 5 players required'}
                required
                inputProps={{ min: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Reference Number"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleChange}
                error={!!errors.paymentReference}
                helperText={errors.paymentReference}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': {
                bgcolor: '#f4511e'
              }
            }}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TournamentRegistrationForm;
