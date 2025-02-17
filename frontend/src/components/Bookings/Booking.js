import { Button, FormLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFutsalCourtDetails, newBooking } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [futsalCourt, setFutsalCourt] = useState(null);
  const [inputs, setInputs] = useState({ timeSlot: "", date: "" });
  const { id } = useParams();

  useEffect(() => {
    getFutsalCourtDetails(id)
      .then((res) => setFutsalCourt(res.futsalCourt))
      .catch((err) => console.log(err));
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
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {futsalCourt && (
        <Fragment>
          {/* Title */}
          <Typography
            padding={3}
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="2.5rem"
            fontWeight="bold"
            color="#fff"
            sx={{
              textAlign: "center",
              background: "linear-gradient(90deg,rgb(96, 65, 27),rgb(232, 147, 37))",
              padding: "15px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
            }}
          >
            Book Your Game: {futsalCourt.title}
          </Typography>

          {/* Main Container */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={4}
            padding={4}
            sx={{ backgroundColor: "#1a1a1a", borderRadius: "10px" }}
          >
            {/* Left Side (Image & Details) */}
            <Box
              display="flex"
              flexDirection="column"
              padding={3}
              width="45%"
              sx={{
                backgroundColor: "#222",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(255, 140, 0, 0.5)",
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
                  boxShadow: "0px 4px 10px rgba(255, 140, 0, 0.5)",
                }}
              />
              <Box padding={3}>
                <Typography color="#fff" fontSize="1.1rem" fontWeight="bold">
                  {futsalCourt.description}
                </Typography>
                <Typography color="#ffcc00" fontWeight="bold" marginTop={1}>
                  📍 Location:{" "}
                  {futsalCourt.locations?.length > 0
                    ? futsalCourt.locations.join(", ")
                    : "Not available"}
                </Typography>
                <Typography color="#ffcc00" fontWeight="bold" marginTop={1}>
                  📅 Opening Date: {new Date(futsalCourt.openingDate).toDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Right Side (Booking Form) */}
            <Box
              width="45%"
              padding={4}
              sx={{
                backgroundColor: "#333",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(255, 215, 0, 0.5)",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <FormLabel sx={{ color: "#ffcc00", fontSize: "1rem" }}>
                    ⏰ Select Time Slot
                  </FormLabel>
                  <TextField
                    name="timeSlot"
                    value={inputs.timeSlot}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter preferred time"
                    variant="outlined"
                    sx={{
                      input: { color: "#fff" },
                      "& .MuiOutlinedInput-root": {
                        borderColor: "#ffcc00",
                        "&:hover fieldset": { borderColor: "#ff8c00" },
                      },
                      width: "100%",
                    }}
                  />

                  <FormLabel sx={{ color: "#ffcc00", fontSize: "1rem" }}>
                    📆 Choose Booking Date
                  </FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    value={inputs.date}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      input: { color: "#fff" },
                      "& .MuiOutlinedInput-root": {
                        borderColor: "#ffcc00",
                        "&:hover fieldset": { borderColor: "#ff8c00" },
                      },
                      width: "100%",
                    }}
                  />

                  <Button
                    type="submit"
                    sx={{
                      marginTop: 3,
                      background: "linear-gradient(90deg, #ff8c00, #ff4500)",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      padding: "10px 25px",
                      borderRadius: "8px",
                      transition: "0.3s",
                      "&:hover": {
                        background: "linear-gradient(90deg, #ff4500, #ff8c00)",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    🎟️ Book Now
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;
