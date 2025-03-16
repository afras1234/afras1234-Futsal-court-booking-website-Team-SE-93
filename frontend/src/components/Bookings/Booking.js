import { Button, FormLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFutsalCourtDetails, newBooking } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [futsalCourt, setFutsalCourt] = useState(null);
  const [inputs, setInputs] = useState({ timeSlot: "", date: "" });
  const { id } = useParams();

  useEffect(() => {
    getFutsalCourtDetails(id)
      .then((res) => setFutsalCourt(res.futsalCourt))
      .catch((err) => console.error("Error fetching futsal court details:", err));
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!futsalCourt) return;

    newBooking({ ...inputs, futsalCourt: futsalCourt._id })
      .then((res) => console.log("Booking successful:", res))
      .catch((err) => console.error("Error making booking:", err));
  };

  const handlePayment = () => {
    alert("Redirecting to payment gateway...");
  };

  return (
    <div>
      {futsalCourt && (
        <>
          <Typography
            padding={3}
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="2.5rem"
            fontWeight="bold"
            color="#fff"
            sx={{
              textAlign: "center",
              background: "linear-gradient(90deg, #ffa500, #ffffff)",
              padding: "15px",
              boxShadow: "0px 4px 8px rgba(255, 165, 0, 0.5)",
              borderRadius: "8px",
            }}
          >
            Book Your Game: {futsalCourt.title}
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={4}
            padding={4}
            sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              padding={3}
              width={{ xs: "100%", md: "45%" }}
              sx={{
                backgroundColor: "#ffa500",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(255, 165, 0, 0.7)",
                textAlign: "center",
              }}
            >
              <img
                src={futsalCourt.websiteUrl}
                alt={futsalCourt.title}
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  boxShadow: "0px 4px 10px rgba(255, 165, 0, 0.7)",
                }}
              />
              <Box padding={3}>
                <Typography color="#fff" fontSize="1.1rem" fontWeight="bold">
                  {futsalCourt.description}
                </Typography>
                <Typography color="#fff" fontWeight="bold" marginTop={1}>
                  📍 Location: {futsalCourt.locations?.length > 0 ? futsalCourt.locations.join(", ") : "Not available"}
                </Typography>
                <Typography color="#fff" fontWeight="bold" marginTop={1}>
                  📅 Opening Date: {new Date(futsalCourt.openingDate).toDateString()}
                </Typography>
              </Box>
            </Box>

            <Box
              width={{ xs: "100%", md: "45%" }}
              padding={4}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(255, 165, 0, 0.5)",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <FormLabel sx={{ color: "#ffa500", fontSize: "1rem" }}>⏰ Select Time Slot</FormLabel>
                  <TextField
                    name="timeSlot"
                    value={inputs.timeSlot}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter preferred time"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />

                  <FormLabel sx={{ color: "#ffa500", fontSize: "1rem" }}>📆 Choose Booking Date</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    value={inputs.date}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />

                  <Button type="submit" sx={{ mt: 3, background: "#ffa500", color: "#fff" }}>🎟️ Book Now</Button>
                  <Button onClick={handlePayment} sx={{ mt: 2, background: "#32CD32", color: "#fff" }}>💳 Pay with Card</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default Booking;
