import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllFutsalCourts } from "../../api-helpers/api-helpers";
import FutsalCourtItem from "./FutsalCourtItem";
import Footer from "../../components/Footer";

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
        background: "#FFFFFF",
        minHeight: "100vh",
        padding: 5,
      }}
    >
      <Typography
        margin={"auto"}
        variant="h4"
        padding={2}
        width="40%"
        bgcolor={"#FF6600"}
        color="white"
        textAlign={"center"}
        fontWeight="bold"
        borderRadius={3}
        boxShadow={"0px 8px 15px rgba(255,102,0,0.4)"}
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
              title={futsalCourt.title}
              image={futsalCourt.image}
              price={futsalCourt.price}
              rating={futsalCourt.rating}
              location={futsalCourt.location}
              isNew={futsalCourt.isNew}
              facilities={futsalCourt.facilities}
              websiteUrl={futsalCourt.websiteUrl}
              openingDate={futsalCourt.openingDate}
              description={futsalCourt.description}
              sx={{
                border: "2px solid #FF6600",
                borderRadius: "10px",
                padding: "10px",
                background: "#FFF",
                boxShadow: "0px 5px 10px rgba(255,102,0,0.3)",
              }}
            />
          ))}
      </Box>
      <Footer />
    </Box>
  );
};

export default FutsalCourts;
