import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFutsalCourts } from "../../api-helpers/api-helpers";
import CardLayout from "./CardLayout";

const HomeLayout = () => {
  const [futsalCourts, setFutsalCourts] = useState([]);
  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => setFutsalCourts(data))
      .catch((err) => console.log(err));
  }, []);
  console.log(futsalCourts);

  return (
    <Box width="100%" height="100vh" marginTop={2} margin="auto">
      <Box margin="auto" width="80%" height="40%" padding={2} display="flex">
        <img
          src="https://w0.peakpx.com/wallpaper/26/401/HD-wallpaper-football-player-is-hitting-a-ball-with-leg-wearing-red-blue-dress-football.jpg"
          alt="Rocketry"
          width="100%"
          height="100%"
        />
      </Box>
      <Box padding={5} margin="auto">
        <Typography variant="h4" textAlign="center">
          Featured Courts Near You.
        </Typography>
      </Box>
      <Box
        gap={5}
        margin="auto"
        width="80%"
        flexWrap="wrap"
        display="flex"
        justifyContent="center"
      >
        {futsalCourts &&
          futsalCourts.slice(0, 4).map((futsalCourt, index) => (
            <CardLayout
              key={futsalCourt._id || index}
              id={futsalCourt._id}
              title={futsalCourt.title}
              openingDate={futsalCourt.openingDate}
              websiteUrl={futsalCourt.websiteUrl}
              description={futsalCourt.description}
              location={futsalCourt.location}
            />
          ))}
      </Box>
      <Box display="flex" padding={5} margin="auto">
        <Button
          variant="outlined"
          component={Link}
          to="/futsalCourts"
          sx={{ margin: "auto", color: "#2b2d42" }}
        >
          View All Futsal Courts
        </Button>
      </Box>
    </Box>
  );
};

export default HomeLayout;
