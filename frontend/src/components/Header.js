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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
  const [authAnchorEl, setAuthAnchorEl] = useState(null);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => {
        setFutsalCourts(data?.futsalCourts || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(isAdminLoggedIn ? adminActions.logout() : userActions.logout());
    localStorage.removeItem("userId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("token");
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
  const handleAuthOpen = (event) => setAuthAnchorEl(event.currentTarget);
  const handleAuthClose = () => setAuthAnchorEl(null);

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
          pointerEvents: "none",
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
            <Button 
              sx={{ 
                color: "white", 
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)"
                }
              }}
              onClick={handleMenuOpen}
            >
              Menu
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  bgcolor: "rgba(43, 45, 66, 0.95)",
                  color: "white",
                  "& .MuiMenuItem-root": {
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/futsalCourts"
                onClick={handleMenuClose}
              >
                Futsal Courts
              </MenuItem>
              {isAdminLoggedIn && (
                <MenuItem
                  component={Link}
                  to="/add"
                  onClick={handleMenuClose}
                >
                  Add Futsal Court
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Profile & Authentication */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isUserLoggedIn && !isAdminLoggedIn ? (
              <>
                <Button
                  onClick={handleAuthOpen}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                  startIcon={<AccountCircleIcon />}
                >
                  Login / Signup
                </Button>
                <Menu
                  anchorEl={authAnchorEl}
                  open={Boolean(authAnchorEl)}
                  onClose={handleAuthClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      bgcolor: "rgba(43, 45, 66, 0.95)",
                      color: "white",
                      "& .MuiMenuItem-root": {
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/auth");
                      handleAuthClose();
                    }}
                  >
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    User Login
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/admin/login");
                      handleAuthClose();
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                    Admin Login
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleProfileOpen}
                  sx={{
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                >
                  {isAdminLoggedIn ? (
                    <AdminPanelSettingsIcon fontSize="large" />
                  ) : (
                    <AccountCircleIcon fontSize="large" />
                  )}
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={Boolean(profileAnchorEl)}
                  onClose={handleProfileClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      bgcolor: "rgba(43, 45, 66, 0.95)",
                      color: "white",
                      "& .MuiMenuItem-root": {
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => {
                    navigate(isAdminLoggedIn ? "/admin-profile" : "/user-profile");
                    handleProfileClose();
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
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
