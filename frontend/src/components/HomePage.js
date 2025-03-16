import React, { useState, useEffect } from 'react';
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
import Footer from './Footer';

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
            </Grid>
          ))}
        </Grid>

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
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
