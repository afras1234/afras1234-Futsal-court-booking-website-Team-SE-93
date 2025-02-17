import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllFutsalCourts } from "../../api-helpers/api-helpers";
import CardLayout from "../HomePage/CardLayout"; // Check if this is the correct name

const AllFutsalCourts = () => {
  const [futsalCourts, setFutsalCourts] = useState([]);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => setFutsalCourts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,rgb(234, 131, 29),rgba(244, 158, 45, 0.38))",
        padding: "40px 20px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        sx={{
          color: "#ffffff",
          padding: "20px 0",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        ⚽ All Futsal Courts
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          margin: "auto",
          padding: "20px",
        }}
      >
        {futsalCourts.length > 0 &&
          futsalCourts.map((futsalCourt) => (
            <Box
              key={futsalCourt._id}
              sx={{
                background: "rgba(255, 255, 255, 0.84)",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease-in-out",
                ":hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 15px 30px rgba(0,0,0,0.4)",
                },
              }}
            >
              <CardLayout
                id={futsalCourt._id}
                title={futsalCourt.title}
                openingDate={futsalCourt.openingDate}
                websiteUrl={futsalCourt.websiteUrl}
                description={futsalCourt.description}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default AllFutsalCourts;
