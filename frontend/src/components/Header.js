import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  IconButton,
  TextField,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getAllFutsalCourts } from "../api-helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [futsalCourts, setFutsalCourts] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => {
        setFutsalCourts(data?.futsalCourts || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(isAdminLoggedIn ? adminActions.logout() : userActions.logout());
    handleProfileClose();
    navigate("/");
  };

  const handleChange = (event, val) => {
    const futsalCourt = futsalCourts.find((m) => m.title === val);
    if (futsalCourt && isUserLoggedIn) {
      navigate(`/booking/${futsalCourt._id}`);
    }
  };

  // Handlers for menus
  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "60vh",
        backgroundImage: `url("https://img.freepik.com/premium-photo/football-futsal-player-ball-futsal-floor-sports-background-indoor-soccer-sports-hall-youth-futsal-league-indoor-football-players-soccer-ball-generative-ai_117038-8122.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
          pointerEvents: "none", // ✅ Prevents blocking UI elements
        },
      }}
    >
      <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", zIndex: 10 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo and Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton component={Link} to="/" sx={{ marginLeft: "10px" }}>
              <SportsSoccerIcon sx={{ fontSize: 45, color: "#fff" }} />
            </IconButton>
            <Button sx={{ color: "white", fontWeight: "bold" }} onClick={handleMenuOpen}>
              Menu
            </Button>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
              <MenuItem component={Link} to="/players" onClick={handleMenuClose}>
                Players
              </MenuItem>
              <MenuItem component={Link} to="/tournaments" onClick={handleMenuClose}>
                Tournaments
              </MenuItem>
              <MenuItem component={Link} to="/booking" onClick={handleMenuClose}>
                Booking
              </MenuItem>
              <MenuItem component={Link} to="/leaderboard" onClick={handleMenuClose}>
                Leaderboard
              </MenuItem>
            </Menu>
          </Box>

          {/* Profile & Authentication */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isUserLoggedIn && !isAdminLoggedIn ? (
              <>
                <Button component={Link} to="/auth?mode=signup" sx={{ color: "white", fontWeight: "bold" }}>
                  Signup
                </Button>
                <Button component={Link} to="/auth?mode=login" sx={{ color: "white", fontWeight: "bold" }}>
                  Login
                </Button>
              </>
            ) : (
              <IconButton onClick={handleProfileOpen} sx={{ color: "white" }}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            )}
            <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose}>
              {isUserLoggedIn || isAdminLoggedIn ? (
                <>
                  <MenuItem component={Link} to={isAdminLoggedIn ? "/admin-profile" : "/user-profile"} onClick={handleProfileClose}>
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </>
              ) : null}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Content with Search Bar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          color: "white",
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "0"
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Welcome to Futsal Booking</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Find and book your favorite futsal courts easily.</p>
        
        {/* Search Bar */}
        <Box 
          sx={{ 
            width: "50%",
            maxWidth: "700px",
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '15px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Autocomplete
            onChange={handleChange}
            freeSolo
            options={futsalCourts.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Futsal Courts"
                variant="outlined"
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    "& fieldset": {
                      borderColor: "transparent"
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent"
                    }
                  }
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
