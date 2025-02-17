import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const FutsalCourtItem = ({ title, openingDate, websiteUrl, id }) => {
  return (
    <Card
      sx={{
        margin: "10px",
        width: 250, // Matches parent Box width
        height: 200, // Matches parent Box height
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.1)", // Semi-transparent effect
        backdropFilter: "blur(5px)",
        boxShadow: "0px 4px 12px rgba(255, 193, 7, 0.3)", // Orange glow
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
        ":hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 6px 18px rgba(255, 193, 7, 0.6)",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensures spacing between elements
      }}
    >
      {/* Image */}
      <img
        height="50%"
        width="100%"
        src={websiteUrl}
        alt={title}
        style={{
          objectFit: "cover",
          filter: "brightness(0.9)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      />

      {/* Content */}
      <CardContent sx={{ padding: "10px", flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "14px", // Maintains consistency
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#ffcc80", // Orange-yellow for contrast
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          {new Date(openingDate).toDateString()}
        </Typography>
      </CardContent>

      {/* Button */}
      <CardActions sx={{ justifyContent: "center", paddingBottom: "8px" }}>
        <Button
          variant="contained"
          component={Link}
          to={`/booking/${id}`}
          sx={{
            bgcolor: "#FF4500",
            fontWeight: "bold",
            letterSpacing: "1px",
            fontSize: "12px",
            padding: "6px 12px",
            ":hover": {
              bgcolor: "#FF8C00",
            },
          }}
          size="small"
        >
          Book Now ⚽
        </Button>
      </CardActions>
    </Card>
  );
};

export default FutsalCourtItem;
