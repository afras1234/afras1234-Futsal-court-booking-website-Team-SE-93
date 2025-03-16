import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ShowerIcon from "@mui/icons-material/Shower";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const FutsalCourtItem = ({ id, title, image, price, rating, location, isNew, facilities = [], openingDate }) => {
  const facilityIcons = {
    Wifi: <WifiIcon fontSize="small" key="wifi" />,
    Parking: <LocalParkingIcon fontSize="small" key="parking" />,
    Showers: <ShowerIcon fontSize="small" key="showers" />,
    Cafe: <RestaurantIcon fontSize="small" key="cafe" />,
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s ease-in-out",
        ":hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: "cover", objectPosition: "center" }}
      />

      {isNew && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#ff5722",
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
          }}
        >
          New
        </Box>
      )}

      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
          <Typography variant="h6" sx={{ color: "#ff5722" }}>
            {price}
          </Typography>
        </Box>

        <Rating value={rating} precision={0.5} size="small" readOnly sx={{ mb: 1 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {location}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {facilities.map((facility) => facilityIcons[facility])}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {openingDate}
          </Typography>
          <Box>
            <IconButton size="small" aria-label="add to favorites">
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="bookmark">
              <BookmarkBorderIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "center", pb: 1 }}>
        <Button
          variant="contained"
          component={Link}
          to={`/booking/${id}`}
          sx={{
            bgcolor: "#FF4500",
            fontWeight: "bold",
            letterSpacing: "1px",
            fontSize: "12px",
            px: 2,
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
