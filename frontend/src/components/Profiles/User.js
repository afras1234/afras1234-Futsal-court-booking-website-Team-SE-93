import React, { useEffect, useState } from "react";
import { Box, IconButton, List, ListItem, Typography, Tabs, Tab, Collapse, ListItemText, Snackbar, Alert } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { deleteBooking, getUserBooking, getUserTournaments, deleteTournament } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// Styled Components
const UserContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  background: `linear-gradient(to right bottom, 
    rgba(0, 0, 0, 0.7), 
    rgba(0, 0, 0, 0.3))`,
  backdropFilter: "blur(2rem)",
  minHeight: "100vh",
  padding: "20px",
  color: "white",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('https://images.unsplash.com/photo-1552318965-6e6be7484ada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1,
  },
});

const ProfileSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "30%",
  background: `linear-gradient(to right bottom,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.4))`,
  backdropFilter: "blur(2rem)",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  zIndex: 2,
});

const ProfileIcon = styled(PersonRoundedIcon)({
  fontSize: "18rem !important",
  color: "white",
});

const UserName = styled(Typography)({
  padding: "10px",
  width: "200px",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "10px",
  fontSize: "18px",
  background: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(20px)",
  color: "white",
  fontWeight: "bold",
});

const BookingSection = styled(Box)({
  width: "65%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "1200px",
  background: `linear-gradient(to right bottom,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.4))`,
  backdropFilter: "blur(2rem)",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  zIndex: 2,
});

const BookingTitle = styled(Typography)({
  fontSize: "2rem",
  fontFamily: "Verdana, sans-serif",
  textAlign: "center",
  padding: "15px",
  color: "white",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
  fontWeight: "bold",
});

const BookingList = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(to right bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3))`,
  backdropFilter: "blur(2rem)",
  borderRadius: "10px",
  padding: "15px",
  boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
});

const StyledList = styled(List)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
  width: "100%",
  padding: "10px",
});

const BookingItem = styled(ListItem)({
  background: `linear-gradient(to right bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3))`,
  backdropFilter: "blur(1rem)",
  color: "white",
  margin: 0,
  borderRadius: "10px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "all 0.3s ease-in-out",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  height: "fit-content",
  "&:hover": {
    transform: "scale(1.02)",
    background: `linear-gradient(to right bottom,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.4))`,
    boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
  },
});

const BookingHeader = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
});

const BookingDetails = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const BookingText = styled(Typography)({
  color: "white",
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: "500",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
});

const BookingStatus = styled(Box)({
  padding: "3px 10px",
  borderRadius: "12px",
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(20px)",
  fontSize: "0.75rem",
  marginLeft: "auto",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  fontWeight: "bold",
});

const DeleteButton = styled(IconButton)({
  color: "rgba(255, 255, 255, 0.8) !important",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.2)",
    color: "#ff1744 !important",
  },
});

const NoBookings = styled(Typography)({
  textAlign: "center",
  color: "white",
  fontSize: "1.2rem",
  marginTop: "20px",
});

const StyledTabs = styled(Tabs)({
  marginBottom: "20px",
  "& .MuiTab-root": {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "1.1rem",
    fontWeight: "bold",
    "&.Mui-selected": {
      color: "white",
    },
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

const TournamentItem = styled(ListItem)({
  background: `linear-gradient(to right bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3))`,
  backdropFilter: "blur(1rem)",
  color: "white",
  margin: 0,
  borderRadius: "15px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "all 0.3s ease-in-out",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  height: "fit-content",
  "&:hover": {
    transform: "scale(1.02)",
    background: `linear-gradient(to right bottom,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.4))`,
    boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
  },
});

const TournamentHeader = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
});

const TournamentText = styled(Typography)({
  color: "white",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "5px",
  fontWeight: "500",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
});

const TournamentStatus = styled(Box)({
  padding: "5px 15px",
  borderRadius: "15px",
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(20px)",
  fontSize: "0.85rem",
  marginLeft: "auto",
  marginTop: "10px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  fontWeight: "bold",
});

const TeamsList = styled(List)({
  width: "100%",
  background: "rgba(0, 0, 0, 0.3)",
  borderRadius: "8px",
  padding: "10px",
  marginTop: "10px",
});

const TeamItem = styled(ListItemText)({
  color: "white",
  "& .MuiListItemText-primary": {
    fontSize: "0.9rem",
    fontWeight: "500",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  },
});

const ExpandButton = styled(IconButton)({
  color: "white",
  padding: "4px",
  marginLeft: "auto",
  marginTop: "5px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});

const User = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedTournaments, setExpandedTournaments] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const fetchBookings = () => {
    getUserBooking()
      .then((res) => setBookings(res.bookings || []))
      .catch((err) => console.log(err));
  };

  const fetchTournaments = () => {
    getUserTournaments()
      .then((res) => setTournaments(res || []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
    fetchTournaments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setSnackbar({
        open: true,
        message: "Booking deleted successfully",
        severity: "success"
      });
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Error deleting booking",
        severity: "error"
      });
    }
  };

  const handleDeleteTournament = (id) => {
    deleteTournament(id)
      .then(() => {
        fetchTournaments();
      })
      .catch((err) => console.log(err));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateTournament = () => {
    navigate('/create-tournament');
  };

  const handleExpandClick = (tournamentId) => {
    setExpandedTournaments(prev => ({
      ...prev,
      [tournamentId]: !prev[tournamentId]
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <UserContainer>
      {/* User Profile Section */}
      <ProfileSection>
        <ProfileIcon />
        <UserName>
          Name: {bookings.length > 0 ? bookings[0]?.user?.name : "Guest"}
        </UserName>
      </ProfileSection>

      {/* Content Section */}
      <BookingSection>
        <StyledTabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            icon={<SportsSoccerIcon />} 
            iconPosition="start" 
            label="Bookings" 
          />
          <Tab 
            icon={<EmojiEventsIcon />} 
            iconPosition="start" 
            label="Tournaments" 
          />
        </StyledTabs>

        {activeTab === 0 ? (
          // Bookings Panel
          <Box>
            <BookingTitle>Your Bookings</BookingTitle>
            <BookingList>
              <StyledList>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <BookingItem key={booking._id}>
                      <BookingHeader>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {booking.futsalCourt.title}
                        </Typography>
                        <DeleteButton onClick={() => handleDelete(booking._id)}>
                          <DeleteForeverOutlined />
                        </DeleteButton>
                      </BookingHeader>
                      
                      <BookingDetails>
                        <BookingText>
                          📅 Date: {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </BookingText>
                        <BookingText>
                          ⏰ Time: {booking.timeSlot}
                        </BookingText>
                        <BookingText>
                          📍 Location: {booking.futsalCourt.locations?.[0] || "Location not specified"}
                        </BookingText>
                        <BookingText>
                          💰 Price: ${booking.futsalCourt.price}
                        </BookingText>
                        <BookingStatus>
                          {new Date(booking.date) > new Date() ? "Upcoming" : "Past Booking"}
                        </BookingStatus>
                      </BookingDetails>
                    </BookingItem>
                  ))
                ) : (
                  <NoBookings>No bookings available.</NoBookings>
                )}
              </StyledList>
            </BookingList>
          </Box>
        ) : (
          // Tournaments Panel
          <Box>
            <BookingTitle>Your Tournaments</BookingTitle>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={handleCreateTournament}
                sx={{
                  color: 'white',
                  background: `linear-gradient(to right bottom,
                    rgba(0, 0, 0, 0.6),
                    rgba(0, 0, 0, 0.3))`,
                  backdropFilter: 'blur(1rem)',
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: `linear-gradient(to right bottom,
                      rgba(0, 0, 0, 0.7),
                      rgba(0, 0, 0, 0.4))`,
                    boxShadow: '0 0 1rem 0 rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
            </Box>
            <BookingList>
              <StyledList>
                {tournaments.length > 0 ? (
                  tournaments.map((tournament) => (
                    <TournamentItem key={tournament._id}>
                      <TournamentHeader>
                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                          {tournament.name}
                        </Typography>
                        <DeleteButton onClick={() => handleDeleteTournament(tournament._id)}>
                          <DeleteForeverOutlined />
                        </DeleteButton>
                      </TournamentHeader>
                      
                      <BookingDetails>
                        <TournamentText>
                          📅 Date: {new Date(tournament.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TournamentText>
                        <TournamentText>
                          👥 Teams: {tournament.registrations?.length || 0}/{tournament.maxTeams}
                        </TournamentText>
                        <TournamentText>
                          🏆 Prize Pool: ${tournament.prizePool}
                        </TournamentText>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                          <TournamentStatus>
                            {tournament.status || "Upcoming"}
                          </TournamentStatus>
                          <ExpandButton
                            onClick={() => handleExpandClick(tournament._id)}
                            aria-expanded={expandedTournaments[tournament._id]}
                            aria-label="show registered teams"
                          >
                            {expandedTournaments[tournament._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </ExpandButton>
                        </Box>
                        <Collapse in={expandedTournaments[tournament._id]} timeout="auto" unmountOnExit>
                          <TeamsList>
                            {tournament.registrations && tournament.registrations.length > 0 ? (
                              tournament.registrations.map((registration, index) => (
                                <Box key={registration.id || index} sx={{ 
                                  mb: 2, 
                                  p: 2, 
                                  bgcolor: 'rgba(0, 0, 0, 0.4)', 
                                  borderRadius: '8px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                  <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600, 
                                    mb: 1,
                                    color: 'white',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    pb: 1
                                  }}>
                                    {index + 1}. {registration.teamName}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 1,
                                    color: 'white'
                                  }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      👤 Captain: {registration.captainName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      📱 Contact: {registration.captainPhone}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      👥 Players: {registration.playerCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      🎫 Payment Ref: {registration.paymentReference}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      📅 Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))
                            ) : (
                              <TeamItem primary="No teams registered yet" />
                            )}
                          </TeamsList>
                        </Collapse>
                      </BookingDetails>
                    </TournamentItem>
                  ))
                ) : (
                  <NoBookings>No tournaments available.</NoBookings>
                )}
              </StyledList>
            </BookingList>
          </Box>
        )}
      </BookingSection>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </UserContainer>
  );
};

export default User;
