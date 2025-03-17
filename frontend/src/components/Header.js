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
  Typography
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
        height: { xs: '70vh', sm: '60vh' },
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://img.freepik.com/premium-photo/football-futsal-player-ball-futsal-floor-sports-background-indoor-soccer-sports-hall-youth-futsal-league-indoor-football-players-soccer-ball-generative-ai_117038-8122.jpg")`,
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
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
          zIndex: 1,
          pointerEvents: "none",
        },
      }}
    >
      <AppBar position="absolute" sx={{ background: 'transparent', boxShadow: 'none', zIndex: 10 }}>
        <Toolbar 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            px: { xs: 2, sm: 4 },
            minHeight: { xs: 64, sm: 72 }
          }}
        >
          {/* Logo and Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton 
              component={Link} 
              to="/" 
              sx={{ 
                p: { xs: 1, sm: 1.5 },
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <SportsSoccerIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: "#fff" }} />
            </IconButton>
            <Button 
              sx={{ 
                color: "white", 
                fontWeight: "bold",
                px: 2,
                py: 1,
                borderRadius: 2,
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
                  mt: 1,
                  bgcolor: "rgba(43, 45, 66, 0.95)",
                  backdropFilter: 'blur(8px)',
                  color: "white",
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.5,
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
                <SportsSoccerIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Futsal Courts
              </MenuItem>
              {isAdminLoggedIn && (
                <MenuItem
                  component={Link}
                  to="/add"
                  onClick={handleMenuClose}
                >
                  <AdminPanelSettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
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
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      border: '1px solid rgba(255, 255, 255, 0.5)'
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
                      mt: 1,
                      bgcolor: "rgba(43, 45, 66, 0.95)",
                      backdropFilter: 'blur(8px)',
                      color: "white",
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      "& .MuiMenuItem-root": {
                        px: 2,
                        py: 1.5,
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
                    <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    User Login
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/admin/login");
                      handleAuthClose();
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
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
                    p: { xs: 1, sm: 1.5 },
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)"
                    }
                  }}
                >
                  {isAdminLoggedIn ? (
                    <AdminPanelSettingsIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  )}
                </IconButton>
                <Menu
                  anchorEl={profileAnchorEl}
                  open={Boolean(profileAnchorEl)}
                  onClose={handleProfileClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      bgcolor: "rgba(43, 45, 66, 0.95)",
                      backdropFilter: 'blur(8px)',
                      color: "white",
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      "& .MuiMenuItem-root": {
                        px: 2,
                        py: 1.5,
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
                      navigate(isAdminLoggedIn ? "/admin-profile" : "/profile");
                      handleProfileClose();
                    }}
                  >
                    <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Profile
                  </MenuItem>
                  {isUserLoggedIn && (
                    <MenuItem 
                      onClick={() => {
                        navigate("/create-tournament");
                        handleProfileClose();
                      }}
                    >
                      <SportsSoccerIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Create Tournament
                    </MenuItem>
                  )}
                  <MenuItem onClick={logout}>
                    <Box sx={{ mr: 1.5, fontSize: 20, display: 'flex', alignItems: 'center' }}>🚪</Box>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Content */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: -4, sm: 0 }
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800,
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            animation: "fadeInDown 0.8s ease-out",
            px: { xs: 2, sm: 4 }
          }}
        >
          Find Your Perfect Court
        </Typography>

        {/* Search Bar */}
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: '800px',
            position: 'relative',
            zIndex: 3,
            px: { xs: 2, sm: 4 },
            animation: "fadeInUp 0.8s ease-out",
            '& .MuiAutocomplete-root': {
              width: '100%'
            },
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            },
            '@keyframes fadeInDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-20px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Autocomplete
            freeSolo
            options={futsalCourts.map((option) => option.title)}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for futsal courts..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: 3,
                    height: { xs: '52px', sm: '60px' },
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff5722'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid rgba(255, 87, 34, 0.3)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary'
                  },
                  '& input::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.8,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Box sx={{ pl: 1.5, color: '#ff5722', display: 'flex', alignItems: 'center' }}>
                      <SportsSoccerIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Box>
                  )
                }}
              />
            )}
          />
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            mt: 3,
            fontWeight: 500,
            opacity: 0.9,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            animation: "fadeInUp 0.8s ease-out",
            animationDelay: "0.2s",
            animationFillMode: "both",
            px: { xs: 2, sm: 4 }
          }}
        >
          Book and play at the best futsal courts near you
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
