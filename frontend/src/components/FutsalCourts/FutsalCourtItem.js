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
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ShowerIcon from "@mui/icons-material/Shower";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {isNew && (
          <Chip
            label="NEW"
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #FF4500, #FF8C00)",
              color: "white",
              boxShadow: "0 4px 8px rgba(255, 69, 0, 0.3)",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            padding: "40px 16px 16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#FF4500",
                fontWeight: "bold",
              }}
            >
              Rs. {price}/hr
            </Typography>
            <Rating
              value={rating}
              precision={0.5}
              size="small"
              readOnly
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#FF8C00",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "#666" }} fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon sx={{ color: "#666" }} fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {openingDate}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            {facilities.map((facility) => (
              <Chip
                key={facility}
                icon={facilityIcons[facility]}
                label={facility}
                size="small"
                sx={{
                  background: "rgba(255, 69, 0, 0.1)",
                  color: "#FF4500",
                  "& .MuiChip-icon": {
                    color: "#FF4500",
                  },
                }}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Box>
          <IconButton
            size="small"
            sx={{
              color: "#FF4500",
              "&:hover": { color: "#FF8C00" },
            }}
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "#FF4500",
              "&:hover": { color: "#FF8C00" },
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to={`/booking/${id}`}
          sx={{
            background: "linear-gradient(45deg, #FF4500, #FF8C00)",
            color: "white",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: "25px",
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(255, 69, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #FF8C00, #FF4500)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(255, 69, 0, 0.4)",
            },
          }}
        >
          Book Now ⚽
        </Button>
      </CardActions>
    </Card>
  );
};

export default FutsalCourtItem;
