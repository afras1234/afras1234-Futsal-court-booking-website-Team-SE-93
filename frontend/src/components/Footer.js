import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link as MuiLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsSoccerIcon sx={{ fontSize: 30, color: '#ff5722', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ArenaX
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#999' }}>
              Your premier destination for futsal court bookings. Experience seamless booking and world-class facilities at ArenaX - where passion meets the pitch.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#ff5722' }} component="a" href="https://www.facebook.com/" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#ff5722' }} component="a" href="https://twitter.com/" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#ff5722' }} component="a" href="https://www.instagram.com/" target="_blank">
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#ff5722' }} component="a" href="https://www.linkedin.com/" target="_blank">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#999',
                  '&:hover': { 
                    color: '#ff5722' 
                  } 
                }}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#999',
                  '&:hover': { 
                    color: '#ff5722' 
                  } 
                }}
              >
                About Us
              </Link>
              <Link 
                to="/futsalCourts" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#999',
                  '&:hover': { 
                    color: '#ff5722' 
                  } 
                }}
              >
                Courts
              </Link>
              <Link 
                to="/tournaments" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#999',
                  '&:hover': { 
                    color: '#ff5722' 
                  } 
                }}
              >
                Tournaments
              </Link>
              <Link 
                to="/contact" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#999',
                  '&:hover': { 
                    color: '#ff5722' 
                  } 
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Court Booking',
                'Tournament Registration',
                'Team Formation',
                'Equipment Rental',
                'Training Sessions'
              ].map((text) => (
                <MuiLink
                  key={text}
                  href="#"
                  underline="none"
                  sx={{
                    color: '#999',
                    '&:hover': { color: '#ff5722' }
                  }}
                >
                  {text}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#ff5722' }} />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  123 Futsal Street, Colombo 05, Sri Lanka
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#ff5722' }} />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  +94 11 234 5678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#ff5722' }} />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  info@arenax.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#999' }}>
            {new Date().getFullYear()} ArenaX. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
