import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Avatar,
  Paper,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTournament, getUserTournaments } from '../api-helpers/api-helpers';

const Profile = () => {
  const [createdTournaments, setCreatedTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        // Fetch user details
        const userId = localStorage.getItem('userId');
        const userResponse = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data.user);
        setEditedUser({
          name: userResponse.data.user.name,
          email: userResponse.data.user.email,
          phone: userResponse.data.user.phone
        });

        // Fetch tournaments created by the user
        const tournamentsResponse = await axios.get('http://localhost:5000/tournaments/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCreatedTournaments(tournamentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/user/${user._id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(editedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleCloseDialog = () => {
    setSelectedTournament(null);
  };

  const handleDeleteTournament = async (event, tournamentId) => {
    event.stopPropagation(); // Prevent card click event
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await deleteTournament(tournamentId);
        // Refresh tournaments list using the API helper
        const updatedTournaments = await getUserTournaments();
        setCreatedTournaments(updatedTournaments);
        alert('Tournament deleted successfully');
      } catch (error) {
        console.error('Error deleting tournament:', error);
        alert(error.response?.data?.message || 'Failed to delete tournament');
      }
    }
  };

  const TournamentCard = ({ tournament }) => (
    <Card 
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
      onClick={() => handleTournamentClick(tournament)}
    >
      <Box
        sx={{
          position: 'relative',
          height: 140,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(255, 87, 34, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.2)' }
          }}
        >
          <SportsSoccerIcon sx={{ fontSize: 24, color: '#ff5722' }} />
        </IconButton>
        <IconButton
          onClick={(e) => handleDeleteTournament(e, tournament._id)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
          }}
        >
          <DeleteIcon sx={{ fontSize: 24, color: '#f44336' }} />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            px: 2,
            letterSpacing: 0.5
          }}
        >
          {tournament.name}
        </Typography>
        <Chip
          label={tournament.status.toUpperCase()}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 70,
            fontWeight: 600,
            letterSpacing: 0.5,
            bgcolor: tournament.status === 'upcoming' ? '#4caf50' : 
                    tournament.status === 'open' ? '#2196f3' :
                    tournament.status === 'closed' ? '#f44336' :
                    tournament.status === 'in_progress' ? '#ff9800' : '#9e9e9e',
            color: 'white'
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            lineHeight: 1.6,
            fontWeight: 500
          }}
        >
          {tournament.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Tournament Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                Teams Registered
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {tournament.registrations?.length || 0}/{tournament.maxTeams}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                Prize Pool
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Rs. {tournament.prizePool.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Dates */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            Tournament Dates
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Start Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(tournament.startDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  End Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(tournament.endDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );

  const RegisteredTeamsDialog = ({ tournament, onClose }) => (
    <Dialog 
      open={Boolean(tournament)} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#ff5722',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {tournament?.name} - Registered Teams
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {tournament?.registrations?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SportsSoccerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No Teams Registered
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There are no teams registered for this tournament yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Team Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Captain</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Players</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Registration Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Ref</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tournament?.registrations?.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell>{registration.teamName}</TableCell>
                    <TableCell>{registration.captainName}</TableCell>
                    <TableCell>{registration.captainPhone}</TableCell>
                    <TableCell>{registration.playerCount}</TableCell>
                    <TableCell>
                      {new Date(registration.registrationDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{registration.paymentReference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#f4511e' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* User Profile Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 6, 
          borderRadius: 3,
          bgcolor: 'grey.50'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100,
              bgcolor: '#ff5722',
              fontSize: '2.5rem'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 3, flex: 1 }}>
            {editMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  name="name"
                  label="Name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  name="email"
                  label="Email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  name="phone"
                  label="Phone"
                  value={editedUser.phone}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateProfile}
                    sx={{
                      bgcolor: '#ff5722',
                      '&:hover': { bgcolor: '#f4511e' }
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    sx={{
                      color: '#ff5722',
                      borderColor: '#ff5722',
                      '&:hover': {
                        borderColor: '#f4511e',
                        bgcolor: 'rgba(255, 87, 34, 0.1)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mr: 2 }}>
                    {user?.name}
                  </Typography>
                  <IconButton 
                    onClick={handleEditToggle}
                    sx={{
                      bgcolor: 'rgba(255, 87, 34, 0.1)',
                      '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.2)' }
                    }}
                  >
                    <EditIcon sx={{ color: '#ff5722' }} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1">{user?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1">{user?.phone}</Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Created Tournaments Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Your Tournaments
          </Typography>
        </Box>

        {createdTournaments.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'grey.50'
            }}
          >
            <SportsSoccerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No Tournaments Created
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You haven't created any tournaments yet. Use the dropdown menu in the header to create a new tournament.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {createdTournaments.map((tournament) => (
              <Grid item xs={12} md={6} lg={4} key={tournament._id}>
                <TournamentCard tournament={tournament} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {/* Registered Teams Dialog */}
      <RegisteredTeamsDialog 
        tournament={selectedTournament} 
        onClose={handleCloseDialog}
      />
    </Container>
  );
};

export default Profile;
