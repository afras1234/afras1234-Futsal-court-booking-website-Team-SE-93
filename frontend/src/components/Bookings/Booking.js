import { Button, TextField, Typography, Snackbar, Alert, ToggleButton, Box, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFutsalCourtDetails, newBooking } from "../../api-helpers/api-helpers";
import { useCart } from "../context/cart";

const TimeSlotBubble = ({ startTime, endTime, isBooked, isSelected, onClick }) => (
  <ToggleButton
    value={`${startTime}-${endTime}`}
    selected={isSelected}
    onChange={() => onClick(`${startTime}-${endTime}`)}
    sx={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      margin: '8px',
      backgroundColor: isBooked ? 'rgba(255, 82, 82, 0.9)' : isSelected ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      color: isBooked || isSelected ? 'white' : '#333',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: isBooked ? 'rgba(255, 82, 82, 0.9)' : isSelected ? 'rgba(67, 160, 71, 0.9)' : 'rgba(255, 255, 255, 0.35)',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      },
      '&.Mui-selected': {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(67, 160, 71, 0.9)',
        },
      },
      '&.Mui-disabled': {
        backgroundColor: 'rgba(255, 82, 82, 0.9)',
        color: 'white',
      }
    }}
    disabled={isBooked}
  >
    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
      {startTime}
    </Typography>
    <Typography variant="body2" align="center" sx={{ fontSize: '0.8rem' }}>
      to
    </Typography>
    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
      {endTime}
    </Typography>
  </ToggleButton>
);

const Booking = () => {
  const navigate = useNavigate();
  const [futsalCourt, setFutsalCourt] = useState(null);
  const [inputs, setInputs] = useState({ timeSlot: "", date: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { id } = useParams();
  const [cart, setCart] = useCart();
  
  // Mock booked slots - replace this with actual booked slots from your backend
  const [bookedSlots] = useState(['8:00-9:00', '14:00-15:00', '17:00-18:00']);

  const amTimeSlots = [
    { start: '6:00', end: '7:00' },
    { start: '7:00', end: '8:00' },
    { start: '8:00', end: '9:00' },
    { start: '9:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' }
  ];

  const pmTimeSlots = [
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' }
  ];

  useEffect(() => {
    getFutsalCourtDetails(id)
      .then((res) => setFutsalCourt(res.futsalCourt))
      .catch((err) => {
        console.error("Error fetching futsal court details:", err);
        setSnackbar({
          open: true,
          message: "Error loading futsal court details",
          severity: "error"
        });
      });
  }, [id]);

  const handleTimeSlotClick = (time) => {
    setInputs(prev => ({ ...prev, timeSlot: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!futsalCourt) return;

    if (!inputs.timeSlot || !inputs.date) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error"
      });
      return;
    }

    newBooking({ ...inputs, futsalCourt: futsalCourt._id })
      .then((res) => {
        setSnackbar({
          open: true,
          message: "Booking successful! Redirecting to your profile...",
          severity: "success"
        });
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error making booking:", err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Error making booking. Please try again.",
          severity: "error"
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePayment = () => {
      const bookingItem = {
        ...inputs,
        courtName: futsalCourt.title,
        price: futsalCourt.price,
        _id: Date.now(), // Temporary ID for cart
      };

      // Add to cart
      const updatedCart = [...cart, bookingItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    navigate('/cart');
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2C3E50, #3498DB)',
        padding: { xs: 2, md: 4 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1552318965-6e6be7484ada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0,
        }
      }}
    >
      {futsalCourt && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              mb: 4,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "2px",
            }}
          >
            Book Your Game: {futsalCourt.title}
            </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              maxWidth: "1400px",
              margin: "0 auto",
              padding: { xs: 2, md: 4 },
            }}
          >
            {/* Court Details Section */}
            <Box
              sx={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <img
                  src={futsalCourt.image}
                  alt={futsalCourt.title}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '20px',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    {futsalCourt.title}
            </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography sx={{ color: 'white', mb: 2, lineHeight: 1.6 }}>
                  {futsalCourt.description}
            </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    📍 {futsalCourt.locations?.length > 0 ? futsalCourt.locations.join(", ") : "Location not available"}
                  </Typography>
                  <Typography sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    📅 {new Date(futsalCourt.openingDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Booking Form Section */}
            <Box
              sx={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                      📆 Select Date
                    </Typography>
                    <TextField
                      name="date"
                      type="date"
                      value={inputs.date}
                      onChange={(e) => setInputs(prev => ({ ...prev, date: e.target.value }))}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '10px',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 1)',
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                      ⏰ Choose Time Slot
            </Typography>
                    
                    {/* AM Slots */}
                    <Paper 
                      elevation={0}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        mb: 3,
                        p: 3,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Morning Slots</Typography>
                      <Grid container justifyContent="center">
                        {amTimeSlots.map((slot) => (
                          <TimeSlotBubble
                            key={`${slot.start}-${slot.end}`}
                            startTime={slot.start}
                            endTime={slot.end}
                            isBooked={bookedSlots.includes(`${slot.start}-${slot.end}`)}
                            isSelected={inputs.timeSlot === `${slot.start}-${slot.end}`}
                            onClick={handleTimeSlotClick}
                          />
                        ))}
          </Grid>
                    </Paper>

                    {/* PM Slots */}
                    <Paper 
                      elevation={0}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        p: 3,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Evening Slots</Typography>
                      <Grid container justifyContent="center">
                        {pmTimeSlots.map((slot) => (
                          <TimeSlotBubble
                            key={`${slot.start}-${slot.end}`}
                            startTime={slot.start}
                            endTime={slot.end}
                            isBooked={bookedSlots.includes(`${slot.start}-${slot.end}`)}
                            isSelected={inputs.timeSlot === `${slot.start}-${slot.end}`}
                            onClick={handleTimeSlotClick}
                          />
                        ))}
                      </Grid>
                    </Paper>
                  </Box>

              <Button
                    type="submit"
                variant="contained"
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #3498DB, #2980B9)',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2980B9, #3498DB)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(52, 152, 219, 0.4)',
                      },
                    }}
              >
                    🎟️ Confirm Booking
              </Button>
                  <Button type="submit" sx={{ mt: 3, background: "#ffa500", color: "#fff" }}>🎟️ Book Now</Button>
                  <Button onClick={handlePayment} sx={{ mt: 2, background: "#32CD32", color: "#fff" }}>💳 Pay with Card</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Booking;
