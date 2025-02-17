import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Box,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { getAllFutsalCourts } from "../api-helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState(0);
  const [futsalCourts, setFutsalCourts] = useState([]);

  useEffect(() => {
    getAllFutsalCourts()
      .then((data) => {
        if (data && data.futsalCourts) {
          setFutsalCourts(data.futsalCourts);
        } else {
          setFutsalCourts([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  const handleChange = (e, val) => {
    const futsalCourt = futsalCourts.find((m) => m.title === val);
    if (futsalCourt && isUserLoggedIn) {
      navigate(`/booking/${futsalCourt._id}`);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg,rgba(248, 107, 13, 0.95),rgb(193, 93, 11))", // Fiery orange-red gradient
        boxShadow: "0px 6px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <IconButton component={Link} to="/" sx={{ marginLeft: "10px" }}>
          <SportsSoccerIcon
            sx={{
              fontSize: 45,
              color: "#fff",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.1)", color: "#ffd700" },
            }}
          />
        </IconButton>

        {/* Search Bar */}
        <Box sx={{ width: "30%", margin: "auto" }}>
          <Autocomplete
            onChange={handleChange}
            freeSolo
            options={futsalCourts.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Futsal Courts"
                variant="standard"
                sx={{
                  width: "100%",
                  "& input": {
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "#ffd700",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#ffcc00",
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tabs
            textColor="inherit"
            indicatorColor="primary"
            value={value}
            onChange={(e, val) => setValue(val)}
            sx={{
              "& .MuiTab-root": {
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
                transition: "color 0.3s ease-in-out",
                "&:hover": {
                  color: "#ffd700",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffd700",
              },
            }}
          >
            <Tab component={Link} to="/futsalCourts" label="Futsal Courts" />
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab component={Link} to="/admin" label="Admin" />
                <Tab component={Link} to="/auth" label="Login" />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab component={Link} to="/user" label="Profile" />
                <Tab
                  component={Link}
                  to="/"
                  label="Logout"
                  onClick={() => logout(false)}
                  sx={{ color: "#ffcc00", "&:hover": { color: "#ff9900" } }}
                />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab component={Link} to="/add" label="Add Futsal Court" />
                <Tab component={Link} to="/user-admin" label="Profile" />
                <Tab
                  component={Link}
                  to="/"
                  label="Logout"
                  onClick={() => logout(true)}
                  sx={{ color: "#ffcc00", "&:hover": { color: "#ff9900" } }}
                />
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
