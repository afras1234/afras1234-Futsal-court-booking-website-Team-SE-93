import React, { useEffect, useState } from "react";
import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import { deleteBooking, getUserBookings } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// Styled Components
const UserContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "linear-gradient(to right, #004d40, #00796b)", // Dark Green Gradient
  minHeight: "100vh",
  padding: "20px",
  color: "white",
});

const ProfileSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "30%",
  background: "rgba(255, 255, 255, 0.1)",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
});

const ProfileIcon = styled(PersonRoundedIcon)({
  fontSize: "18rem !important",
  color: "#ffeb3b", // Yellow contrast color
});

const UserName = styled(Typography)({
  padding: "10px",
  width: "200px",
  textAlign: "center",
  border: "2px solid white",
  borderRadius: "10px",
  fontSize: "18px",
  background: "rgba(255, 255, 255, 0.2)",
});

const BookingSection = styled(Box)({
  width: "65%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const BookingTitle = styled(Typography)({
  fontSize: "2.5rem",
  fontFamily: "Verdana, sans-serif",
  textAlign: "center",
  padding: "20px",
  color: "#ffeb3b", // Yellow highlight
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
});

const BookingList = styled(Box)({
  width: "80%",
  display: "flex",
  flexDirection: "column",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "10px",
  padding: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
});

const BookingItem = styled(ListItem)({
  background: "#00897b", // Vibrant Green
  color: "white",
  textAlign: "center",
  margin: "10px 0",
  borderRadius: "10px",
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    background: "#00695c",
  },
});

const BookingText = styled(ListItemText)({
  margin: "5px",
  width: "120px",
  textAlign: "left",
  fontSize: "16px",
});

const DeleteButton = styled(IconButton)({
  color: "#ff1744 !important",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.2)",
  },
});

const NoBookings = styled(Typography)({
  textAlign: "center",
  color: "white",
  fontSize: "1.2rem",
  marginTop: "20px",
});

const User = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getUserBookings()
      .then((res) => setBookings(res.bookings || []))
      .catch((err) => console.log(err));
  }, []);

  console.log(bookings);

  const handleDelete = (id) => {
    deleteBooking(id)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
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

      {/* Booking List Section */}
      <BookingSection>
        <BookingTitle>Bookings</BookingTitle>

        <BookingList>
          <List>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingItem key={booking._id}>
                  <BookingText primary={`Futsal Court: ${booking.futsalCourt.title}`} />
                  <BookingText primary={`Time Slot: ${booking.timeSlot}`} />
                  <BookingText primary={`Date: ${new Date(booking.date).toDateString()}`} />
                  <DeleteButton onClick={() => handleDelete(booking._id)}>
                    <DeleteForeverOutlined />
                  </DeleteButton>
                </BookingItem>
              ))
            ) : (
              <NoBookings>No bookings available.</NoBookings>
            )}
          </List>
        </BookingList>
      </BookingSection>
    </UserContainer>
  );
};

export default User;
