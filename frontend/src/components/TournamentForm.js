import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const TournamentForm = () => {
  const [formData, setFormData] = useState({
    tournamentName: '',
    description: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    venue: '',
    maxTeams: '',
    entryFee: '',
    prizePool: '',
    tournamentType: '',
    registrationDeadline: null
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // TODO: Add API call to create tournament
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbarMessage('Tournament created successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Reset form
        setFormData({
          tournamentName: '',
          description: '',
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          venue: '',
          maxTeams: '',
          entryFee: '',
          prizePool: '',
          tournamentType: '',
          registrationDeadline: null
        });
      } else {
        throw new Error('Failed to create tournament');
      }
    } catch (error) {
      setSnackbarMessage('Failed to create tournament. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <EmojiEventsIcon sx={{ fontSize: 40, color: '#ff5722', mr: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Create Tournament
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Tournament Name"
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(value) => handleDateChange('startDate', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(value) => handleDateChange('startTime', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={(value) => handleDateChange('endTime', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Maximum Teams"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Entry Fee"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Prize Pool"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Tournament Type</InputLabel>
                <Select
                  name="tournamentType"
                  value={formData.tournamentType}
                  onChange={handleChange}
                  label="Tournament Type"
                >
                  <MenuItem value="knockout">Knockout</MenuItem>
                  <MenuItem value="league">League</MenuItem>
                  <MenuItem value="groupAndKnockout">Group + Knockout</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Registration Deadline"
                  value={formData.registrationDeadline}
                  onChange={(value) => handleDateChange('registrationDeadline', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: '#ff5722',
                  '&:hover': { bgcolor: '#f4511e' }
                }}
              >
                Create Tournament
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TournamentForm;
