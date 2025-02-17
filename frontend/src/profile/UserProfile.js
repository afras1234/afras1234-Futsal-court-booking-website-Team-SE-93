import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
} from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserBooking()
      .then((res) => {
        console.log("User Bookings Response:", res);
        setBookings(res?.bookings?.filter((b) => b && b.futsalCourt) || []);
      })
      .catch((err) => console.error("Error fetching bookings:", err));

    getUserDetails()
      .then((res) => {
        console.log("User Details Response:", res);
        setUser(res?.user || null);
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, []);

  const handleDelete = (id) => {
    deleteBooking(id)
      .then((res) => {
        console.log("Deleted Booking Response:", res);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      })
      .catch((err) => console.error("Error deleting booking:", err));
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(120deg, #111, #222)",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Fragment>
        {user && (
          <Card
            sx={{
              width: "350px",
              textAlign: "center",
              background: "#ff6600",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0px 10px 20px rgba(255, 102, 0, 0.5)",
              marginBottom: "35px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <AccountCircleIcon sx={{ fontSize: "9rem", color: "#222" }} />
              </Box>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  borderBottom: "3px solid black",
                  paddingBottom: "7px",
                  marginBottom: "15px",
                }}
              >
                Name: {user.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                  borderBottom: "2px solid black",
                  paddingBottom: "5px",
                }}
              >
                Email: {user.email}
              </Typography>
            </CardContent>
          </Card>
        )}

        {bookings.length > 0 && (
          <Box
            sx={{
              width: "90%",
              maxWidth: "750px",
              background: "rgba(255, 102, 0, 0.2)",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0px 10px 20px rgba(255, 102, 0, 0.4)",
            }}
          >
            <Typography
              sx={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "#ff6600",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Your Bookings
            </Typography>
            <List sx={{ width: "100%" }}>
              {bookings.map((booking, index) => (
                <ListItem
                  key={index}
                  sx={{
                    background: "#222",
                    color: "white",
                    textAlign: "left",
                    margin: "10px 0",
                    borderRadius: "12px",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)", background: "#ff3300" },
                  }}
                >
                  <ListItemText
                    sx={{ flexGrow: 1, padding: "8px", fontWeight: "bold", fontSize: "16px" }}
                    primary={`🏆 Futsal Court: ${booking.futsalCourt?.title || "N/A"}`}
                  />
                  <ListItemText
                    sx={{ flexGrow: 1, padding: "8px", fontWeight: "bold", fontSize: "16px" }}
                    primary={`⏰ Time Slot: ${booking.timeSlot || "N/A"}`}
                  />
                  <ListItemText
                    sx={{ flexGrow: 1, padding: "8px", fontWeight: "bold", fontSize: "16px" }}
                    primary={`📅 Date: ${booking.date ? new Date(booking.date).toDateString() : "N/A"}`}
                  />
                  <IconButton
                    onClick={() => handleDelete(booking._id)}
                    sx={{
                      color: "#ff6600 !important",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { color: "red !important", transform: "scale(1.3)" },
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Fragment>

      {/* Pulsing Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default UserProfile;
