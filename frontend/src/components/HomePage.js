import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
<<<<<<< HEAD
  IconButton,
  Rating
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ShowerIcon from '@mui/icons-material/Shower';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { getAllFutsalCourts } from '../api-helpers/api-helpers';
=======
  Paper,
  Rating,
  Chip,
  Divider,
  CardActions,
  IconButton
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
import Footer from './Footer';
import TournamentRegistrationForm from './TournamentRegistrationForm';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

<<<<<<< HEAD
const HomePage = () => {
  const [futsalCourts, setFutsalCourts] = useState([]);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => {
        setFutsalCourts(data.futsalCourts || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ mt: '20vh' }}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
          Featured Courts Near You.
        </Typography>

        <Grid container spacing={3}>
          {futsalCourts.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court.id}>
              <Card
=======
const TournamentCard = ({ tournament, onRegister, isAuthenticated }) => {
  const isUpcomingOrOpen = tournament.status === 'upcoming' || tournament.status === 'open';
  const buttonDisabled = !isUpcomingOrOpen || tournament.registeredUsers?.length >= tournament.maxTeams || !isAuthenticated;

  const getButtonText = () => {
    if (!isAuthenticated) return 'Login to Register';
    if (tournament.registeredUsers?.length >= tournament.maxTeams) return 'Tournament Full';
    if (!isUpcomingOrOpen) return 'Registration Closed';
    return 'Register Now';
  };

  return (
    <Card
      elevation={4}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Tournament Banner */}
      <Box
        sx={{
          height: 180,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          bgcolor: 'grey.100',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            px: 3,
            py: 2,
            letterSpacing: 0.5
          }}
        >
          {tournament.name}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Status Badge */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={tournament.status.toUpperCase()}
            size="medium"
            sx={{
              px: 2,
              height: 32,
              fontWeight: 600,
              letterSpacing: 0.5,
              borderRadius: 2,
              bgcolor: isUpcomingOrOpen ? '#4caf50' : '#f44336',
              color: 'white'
            }}
          />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {tournament.registeredUsers?.length || 0}/{tournament.maxTeams} Teams
          </Typography>
        </Box>

        {/* Tournament Info */}
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

        {/* Dates */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
          </Box>
        </Box>

        {/* Prize and Fee */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Prize Pool
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Rs. {tournament.prizePool.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Registration Fee
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Rs. {tournament.registrationFee.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Action Button */}
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={buttonDisabled}
          onClick={() => onRegister(tournament)}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            bgcolor: '#ff5722',
            '&:hover': {
              bgcolor: '#f4511e',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          {getButtonText()}
        </Button>
      </CardActions>
    </Card>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [visibleTournaments, setVisibleTournaments] = useState(3);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [openRegistrationForm, setOpenRegistrationForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchTournaments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tournaments');
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load tournaments',
          severity: 'error'
        });
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = (tournament) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSelectedTournament(tournament);
    setOpenRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    setOpenRegistrationForm(false);
    setSnackbar({
      open: true,
      message: 'Successfully registered for tournament!',
      severity: 'success'
    });

    // Refresh tournaments list
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tournaments');
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  };

  const handleRegistrationError = (error) => {
    setSnackbar({
      open: true,
      message: error.message || 'Failed to register for tournament',
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewMore = () => {
    setVisibleTournaments(prev => 
      prev === tournaments.length ? 3 : tournaments.length
    );
  };

  return (
    <Box>
     

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                bgcolor: 'transparent'
              }}
            >
              <IconButton
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 87, 34, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.2)' }
                }}
              >
<<<<<<< HEAD
                <CardMedia
                  component="img"
                  height="200"
                  image={court.image}
                  alt={court.name}
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                {court.isNew && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: '#ff5722',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    New
                  </Box>
                )}

                <CardContent>
                  <Typography variant="h6">{court.name}</Typography>
                  <Rating value={court.rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {court.location}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {court.facilities.includes('Wifi') && <WifiIcon fontSize="small" />}
                    {court.facilities.includes('Parking') && <LocalParkingIcon fontSize="small" />}
                    {court.facilities.includes('Showers') && <ShowerIcon fontSize="small" />}
                    {court.facilities.includes('Cafe') && <RestaurantIcon fontSize="small" />}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton size="small">
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <BookmarkBorderIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
=======
                <SearchIcon sx={{ fontSize: 40, color: '#ff5722' }} />
              </IconButton>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Easy Search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find the perfect court with our advanced search and filtering system
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                bgcolor: 'transparent'
              }}
            >
              <IconButton
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 87, 34, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.2)' }
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 40, color: '#ff5722' }} />
              </IconButton>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Booking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Book your preferred time slot instantly with our real-time booking system
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                bgcolor: 'transparent'
              }}
            >
              <IconButton
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 87, 34, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.2)' }
                }}
              >
                <SportsSoccerIcon sx={{ fontSize: 40, color: '#ff5722' }} />
              </IconButton>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Join Tournaments
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Participate in exciting tournaments and compete with other teams
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Tournaments Section */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="h3" sx={{ mb: 6, fontWeight: 700, textAlign: 'center' }}>
          Active Tournaments
        </Typography>

        <Grid container spacing={4}>
          {tournaments.slice(0, visibleTournaments).map((tournament) => (
            <Grid item xs={12} md={6} lg={4} key={tournament._id}>
              <TournamentCard
                tournament={tournament}
                onRegister={handleRegister}
                isAuthenticated={isAuthenticated}
              />
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
            </Grid>
          ))}
        </Grid>

<<<<<<< HEAD
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
          <Button
            variant="outlined"
            component={Link}
            to="/courts"
            sx={{
              borderColor: '#ff5722',
              color: '#ff5722',
              '&:hover': {
                borderColor: '#f4511e',
                bgcolor: 'rgba(244, 81, 30, 0.1)'
              }
            }}
          >
            View More Courts
          </Button>
        </Box>
=======
        {tournaments.length > 3 && (
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button
              onClick={handleViewMore}
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: '#ff5722',
                color: '#ff5722',
                '&:hover': {
                  borderColor: '#f4511e',
                  bgcolor: 'rgba(244, 81, 30, 0.04)'
                }
              }}
            >
              {visibleTournaments === 3 ? 'View More' : 'Show Less'}
            </Button>
          </Box>
        )}
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
      </Container>

      {/* Registration Form Dialog */}
      <TournamentRegistrationForm
        open={openRegistrationForm}
        onClose={() => setOpenRegistrationForm(false)}
        tournament={selectedTournament}
        onSuccess={handleRegistrationSuccess}
        onError={handleRegistrationError}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default HomePage;
