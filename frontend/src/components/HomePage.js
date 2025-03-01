import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  Paper,
  Rating,
  TextField,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ShowerIcon from '@mui/icons-material/Shower';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SearchIcon from '@mui/icons-material/Search';
import Footer from './Footer';

const HomePage = () => {
  const featuredCourts = [
    {
      id: 1,
      name: 'Colombo Futsal Club',
      price: 'Rs. 4000',
      location: '75 Galle Rd, Dehiwala West',
      image: 'https://images.unsplash.com/photo-1624456735729-03594a40c5fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      isNew: true,
      rating: 4.5,
      facilities: ['Wifi', 'Parking', 'Showers', 'Cafe']
    },
    {
      id: 2,
      name: 'Mickits Arena',
      price: 'Rs. 3800',
      location: '45/5, Old Kesbewa Rd, Boralesgamuwa',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      isNew: true,
      rating: 4.2,
      facilities: ['Wifi', 'Parking', 'Showers']
    },
    {
      id: 3,
      name: 'Goal at Nawala',
      price: 'Rs. 5000',
      location: '43/17, Sri Subuthipura Mawatha, Sri Jayawardenepura Kotte',
      image: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      isNew: true,
      rating: 4.8,
      facilities: ['Wifi', 'Parking', 'Showers', 'Cafe']
    }
  ];

  const testimonials = [
    {
      name: "Kasun Perera",
      comment: "Best futsal experience! Clean courts and great facilities.",
      rating: 5
    },
    {
      name: "Amal Silva",
      comment: "Professional staff and well-maintained courts. Highly recommended!",
      rating: 4
    },
    {
      name: "Dinesh Kumar",
      comment: "Regular player here. Love the atmosphere and competitive spirit.",
      rating: 5
    }
  ];

  const tournaments = [
    {
      name: "Summer Futsal Championship",
      date: "March 15, 2025",
      prize: "Rs. 100,000"
    },
    {
      name: "Corporate League",
      date: "April 1, 2025",
      prize: "Rs. 75,000"
    }
  ];

  return (
    <Box sx={{ mt: '20vh' }}>
      {/* Featured Courts Section */}
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
          Featured Courts Near You.
        </Typography>
        
        <Grid container spacing={3}>
          {featuredCourts.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h3">
                      {court.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ color: '#ff5722' }}>
                      {court.price}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Rating value={court.rating} precision={0.5} size="small" readOnly />
                  </Box>
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
                    <Typography variant="caption" color="text.secondary">
                      3 years ago
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <FavoriteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <BookmarkBorderIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View More Button */}
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

        {/* Quick Booking Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Book in 3 Easy Steps
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <SearchIcon />, title: "Find Court", description: "Search for available courts in your area" },
              { icon: <SportsSoccerIcon />, title: "Choose Time", description: "Select your preferred date and time slot" },
              { icon: <EmojiEventsIcon />, title: "Play!", description: "Confirm booking and enjoy your game" }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'transparent',
                    border: '2px solid #ff5722',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ color: '#ff5722', mb: 2 }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            What Our Players Say
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      - {testimonial.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Upcoming Tournaments */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Upcoming Tournaments
          </Typography>
          <Grid container spacing={3}>
            {tournaments.map((tournament, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2,
                  bgcolor: '#f5f5f5'
                }}>
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#ff5722', mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{tournament.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {tournament.date}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ color: '#ff5722' }}>
                      Prize Pool: {tournament.prize}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              component={Link}
              to="/create-tournament"
              variant="contained"
              startIcon={<EmojiEventsIcon />}
              sx={{
                bgcolor: '#ff5722',
                '&:hover': { bgcolor: '#f4511e' }
              }}
            >
              Create Tournament
            </Button>
          </Box>
        </Box>

        {/* Newsletter Subscription */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stay Updated
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Subscribe to get the latest updates on new courts and tournaments
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <TextField
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              sx={{ width: { xs: '100%', sm: '300px' } }}
            />
            <Button 
              variant="contained"
              sx={{
                bgcolor: '#ff5722',
                '&:hover': { bgcolor: '#f4511e' }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;