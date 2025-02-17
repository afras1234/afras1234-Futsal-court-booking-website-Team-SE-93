import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { getAdminData } from "../../api-helpers/api-helpers";

const Admin = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    getAdminData()
      .then((res) => setAdmin(res.admin))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="row"
      sx={{
        background: "linear-gradient(to right, #0B3D91, #1E90FF)",
        color: "white",
        padding: 4,
      }}
    >
      {/* Admin Profile Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="30%"
        sx={{
          background: "#004E98",
          padding: 4,
          borderRadius: 4,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <PersonRoundedIcon sx={{ fontSize: "15rem", color: "#FFD700" }} />
        <Typography
          padding={2}
          width="220px"
          textAlign="center"
          sx={{
            border: "2px solid #FFD700",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          Email: {admin?.email || "Loading..."}
        </Typography>
      </Box>

      {/* Futsal Courts List Section */}
      <Box width="70%" display="flex" flexDirection="column" padding={3}>
        <Typography
          variant="h3"
          fontFamily="Verdana"
          textAlign="center"
          padding={2}
          sx={{ color: "#FFD700", fontWeight: "bold" }}
        >
          Added Futsal Courts
        </Typography>

        <Box margin="auto" display="flex" flexDirection="column" width="80%">
          <List>
            {admin?.addedFutsalCourts?.length > 0 ? (
              admin.addedFutsalCourts.map((futsalCourt, index) => (
                <ListItem
                  key={futsalCourt._id || index}
                  sx={{
                    bgcolor: "#32CD32",
                    color: "white",
                    textAlign: "center",
                    margin: 1,
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <ListItemText
                    sx={{ margin: 1, textAlign: "left", fontWeight: "bold" }}
                    primary={`Futsal Court: ${futsalCourt.title}`}
                  />
                  <ListItemText
                    sx={{ margin: 1, textAlign: "left" }}
                    primary={`Opening Date: ${new Date(futsalCourt.openingDate).toDateString()}`}
                  />
                  <ListItemText
                    sx={{ margin: 1, textAlign: "left" }}
                    primary={`Description: ${futsalCourt.description}`}
                  />
                  <ListItemText
                    sx={{ margin: 1, textAlign: "left" }}
                    primary={`Locations: ${futsalCourt.locations?.join(", ")}`}
                  />
                  <ListItemText
                    sx={{ margin: 1, textAlign: "left" }}
                    primary={`Website Url: ${futsalCourt.websiteUrl}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography textAlign="center" color="#FFD700">
                No Futsal Courts Added.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
