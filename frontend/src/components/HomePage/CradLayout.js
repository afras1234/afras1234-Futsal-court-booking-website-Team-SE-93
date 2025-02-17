import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const CardLayout = ({ title, description, openingDate, websiteUrl,locations, id }) => {
  return (
    <Card
      sx={{
        width: 250,
        height: 320,
        borderRadius: 5,
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      <img
        height="50%"
        width="100%"
        src={websiteUrl}
        alt={title}
        style={{ objectFit: "cover", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(openingDate).toDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.primary">
          Locations: {locations?.join(", ")}
        </Typography>

      </CardContent>
      <CardActions>
        <Button
          LinkComponent={Link}
          to={`/booking/${id}`}
          fullWidth
          variant="contained"
          sx={{
            margin: "auto",
            bgcolor: "#2b2d42",
            ":hover": {
              bgcolor: "#121217",
            },
            borderRadius: 5,
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardLayout;
