import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  IconButton,
  Dialog,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TournamentForm from './TournamentForm';

const UserTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [editTournament, setEditTournament] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTournaments();
  }, []);

  const token = localStorage.getItem('token');
if (!token) {
  // Handle the case where the token is missing
  console.error('No token found');
  return;
}

  const fetchUserTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token found in localStorage:", token);  // This will log the token to the console
  
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const response = await fetch('http://localhost:5000/tournaments/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      

      if (response.status === 401) {
        // Token is invalid or expired, so log the user out
        alert("Session expired, please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleEdit = (tournament) => {
    setEditTournament(tournament);
    setOpenDialog(true);
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        const response = await fetch(`/tournaments/${tournamentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          fetchUserTournaments();
        }
      } catch (error) {
        console.error('Error deleting tournament:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditTournament(null);
    fetchUserTournaments();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Tournaments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-tournament')}
        >
          Create Tournament
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tournaments.map((tournament) => (
          <Grid item xs={12} sm={6} md={4} key={tournament._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {tournament.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {tournament.description}
                </Typography>
                <Typography variant="body2">
                  Start Date: {formatDate(tournament.startDate)}
                </Typography>
                <Typography variant="body2">
                  End Date: {formatDate(tournament.endDate)}
                </Typography>
                <Typography variant="body2">
                  Prize Pool: Rs. {tournament.prizePool}
                </Typography>
                <Typography variant="body2">
                  Registration Fee: Rs. {tournament.registrationFee}
                </Typography>
                <Typography variant="body2">
                  Max Teams: {tournament.maxTeams}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  onClick={() => handleEdit(tournament)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(tournament._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <TournamentForm
          editMode={true}
          tournamentData={editTournament}
        />
      </Dialog>
    </Box>
  );
};

export default UserTournaments;
