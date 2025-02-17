import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFutsalCourts } from "../api-helpers/api-helpers";
import FutsalCourtItem from "./FutsalCourts/FutsalCourtItem";

const HomePage = () => {
  const [futsalCourts, setFutsalCourts] = useState([]);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => {
        setFutsalCourts(data.futsalCourts || []);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        margin: "auto",
        paddingTop: "20px",
        background: "linear-gradient(135deg,rgb(207, 155, 106),rgb(100, 62, 10))", // Sports-themed dark blue gradient
        color: "white",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Hero Image Section */}
      <Box
        sx={{
          width: "85%",
          height: "45vh",
          margin: "auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <img
          src="https://w0.peakpx.com/wallpaper/26/401/HD-wallpaper-football-player-is-hitting-a-ball-with-leg-wearing-red-blue-dress-football.jpg"
          alt="Football Player Kicking a Ball"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Latest Releases Title */}
      <Box sx={{ padding: "25px", textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "32px",
            fontWeight: "bold",
            textTransform: "uppercase",
            color: "#fdd835", // Vibrant yellow for a sporty vibe
            letterSpacing: "1px",
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          ⚽ Latest Opening Futsal Courts 🏆
        </Typography>
      </Box>

      {/* Futsal Court Items */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "25px",
          width: "85%",
          margin: "auto",
          padding: "25px",
        }}
      >
        {futsalCourts.slice(0, 4).map((futsalCourt) => (
          <Box
            key={futsalCourt._id}
            sx={{
              width: "250px",
              height: "200px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
              padding: "10px",
              color: "white",
              boxShadow: "0px 4px 12px rgba(255, 193, 7, 0.3)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 18px rgba(255, 193, 7, 0.6)" },
            }}
          >
            <FutsalCourtItem
              id={futsalCourt._id}
              title={futsalCourt.title}
              websiteUrl={futsalCourt.websiteUrl}
              openingDate={futsalCourt.openingDate}
              locations={futsalCourt.locations}
            />
          </Box>
        ))}
      </Box>

      {/* View All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", padding: "30px" }}>
        <Button
          component={Link}
          to="/futsalCourts"
          variant="contained"
          sx={{
            background: "#ff4500", // Sports-themed vibrant orange
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "10px",
            textTransform: "uppercase",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0px 6px 12px rgba(255, 69, 0, 0.3)",
            "&:hover": {
              background: "#e63900",
              transform: "scale(1.08)",
              boxShadow: "0px 8px 18px rgba(255, 69, 0, 0.6)",
            },
          }}
        >
          View All Futsal Courts
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
