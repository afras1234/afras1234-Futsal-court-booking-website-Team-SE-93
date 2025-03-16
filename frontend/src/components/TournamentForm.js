import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { createTournament, updateTournament } from '../api-helpers/api-helpers';

const TournamentForm = ({ editMode = false, tournamentData = null }) => {
  const [formData, setFormData] = useState({
    name: editMode ? tournamentData?.name : '',
    description: editMode ? tournamentData?.description : '',
    startDate: editMode ? tournamentData?.startDate?.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: editMode ? tournamentData?.endDate?.split('T')[0] : new Date().toISOString().split('T')[0],
    maxTeams: editMode ? tournamentData?.maxTeams : '',
    prizePool: editMode ? tournamentData?.prizePool : '',
    registrationFee: editMode ? tournamentData?.registrationFee : ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxTeams: parseInt(formData.maxTeams),
        prizePool: parseFloat(formData.prizePool),
        registrationFee: parseFloat(formData.registrationFee)
      };

      if (editMode) {
        await updateTournament(tournamentData._id, processedData);
      } else {
        await createTournament(processedData);
      }

      alert(editMode ? 'Tournament updated successfully!' : 'Tournament created successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to save tournament');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {editMode ? 'Edit Tournament' : 'Create Tournament'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Tournament Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            label="Maximum Teams"
            name="maxTeams"
            type="number"
            value={formData.maxTeams}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Prize Pool"
            name="prizePool"
            type="number"
            value={formData.prizePool}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Registration Fee"
            name="registrationFee"
            type="number"
            value={formData.registrationFee}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
          >
            {editMode ? 'Update Tournament' : 'Create Tournament'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TournamentForm;
