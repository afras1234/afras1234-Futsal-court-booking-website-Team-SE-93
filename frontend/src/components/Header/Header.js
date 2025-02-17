import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer"; // Fixed Icon Import
import { getAllFutsalCourts } from "../../api-helpers/api-helpers";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user-slice";
import { adminActions } from "../../store/admin-slice";

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);

  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllFutsalCourts()
      .then((response) => setData(response.futsalCourts || [])) // Ensuring correct data extraction
      .catch((err) => console.log(err));
  }, []);

  console.log(data);

  const handleChange = (e, val) => {
    const futsalCourt = data.find((fc) => fc.title === val);
    if (futsalCourt && isUserLoggedIn) {
      navigate(`/booking/${futsalCourt._id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
      <Toolbar>
        <Box width="20%">
          <Link to="/" style={{ color: "white" }}>
            <SportsSoccerIcon /> {/* Fixed Icon */}
          </Link>
        </Box>
        <Box width="50%" marginRight="auto" marginLeft="auto">
          <Autocomplete
            onChange={handleChange}
            sx={{ borderRadius: 10, width: "40%", margin: "auto" }}
            freeSolo
            id="search-futsal-courts"
            disableClearable
            options={data.map((option) => option.title || "")} // Ensured mapping doesn't fail
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  borderRadius: 2,
                  input: { color: "white" },
                  bgcolor: "#2b2d42",
                  padding: "6px",
                }}
                variant="standard"
                placeholder="Search Futsal Courts"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
        </Box>
        <Box display="flex">
          <Tabs
            onChange={(e, val) => setValue(val)}
            value={value}
            textColor="inherit"
          >
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab to="/auth" LinkComponent={NavLink} label="Auth" />
                <Tab to="/admin" LinkComponent={NavLink} label="Admin" />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab LinkComponent={Link} to="/user" label="User" />
                <Tab
                  onClick={() => dispatch(userActions.logout())}
                  LinkComponent={Link}
                  to="/"
                  label="Logout"
                />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab LinkComponent={Link} to="/profile" label="Profile" />
                <Tab LinkComponent={Link} to="/add" label="Add Futsal Court" />
                <Tab
                  onClick={() => dispatch(adminActions.logout())}
                  LinkComponent={Link}
                  to="/"
                  label="Logout"
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
