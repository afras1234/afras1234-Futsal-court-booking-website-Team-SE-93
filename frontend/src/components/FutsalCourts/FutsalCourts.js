import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllFutsalCourts } from "../../api-helpers/api-helpers";
import FutsalCourtItem from "./FutsalCourtItem";

const FutsalCourts = () => {
  const [futsalCourts, setFutsalCourts] = useState([]);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => setFutsalCourts(data.futsalCourts))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      margin={"auto"}
      marginTop={4}
      sx={{
        background: "linear-gradient(135deg,rgb(247, 187, 113), #001a00)", // Dark green gradient
        minHeight: "100vh",
        padding: 5,
      }}
    >
      <Typography
        margin={"auto"}
        variant="h4"
        padding={2}
        width="40%"
        bgcolor={"#FF4500"} // Sports Green
        color="white"
        textAlign={"center"}
        fontWeight="bold"
        borderRadius={3}
        boxShadow={"0px 8px 15px rgba(0,0,0,0.3)"}
      >
        ⚽ All Futsal Courts ⚽
      </Typography>
      <Box
        width={"100%"}
        margin="auto"
        marginTop={5}
        display={"flex"}
        justifyContent="center"
        flexWrap={"wrap"}
        gap={3}
      >
        {futsalCourts &&
          futsalCourts.map((futsalCourt) => (
            <FutsalCourtItem
              key={futsalCourt._id}
              id={futsalCourt._id}
              websiteUrl={futsalCourt.websiteUrl}
              openingDate={futsalCourt.openingDate}
              title={futsalCourt.title}
              locations={futsalCourt.locations}
              description={futsalCourt.description}
            />
          ))}
      </Box>
    </Box>
  );
};

export default FutsalCourts;
