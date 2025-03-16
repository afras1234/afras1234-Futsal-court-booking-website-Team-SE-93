import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { getAdminById } from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 30%, #ff6600 70%)",
        fontFamily: "'Bebas Neue', sans-serif",
        color: "#ff6600",
      }}
    >
      <Fragment>
        {admin && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "40%",
              padding: 4,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(255, 102, 0, 0.7)",
              textAlign: "center",
              transition: "0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 25px rgba(255, 102, 0, 0.85)",
              },
            }}
          >
            <AccountCircleIcon
              sx={{
                fontSize: "12rem",
                color: "#ff6600",
                animation: "pulse 1.5s infinite alternate",
              }}
            />

            <Typography
              mt={2}
              padding={1}
              border="2px solid #ff6600"
              borderRadius={2}
              sx={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                letterSpacing: "1px",
                color: "#ff6600",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#ff6600",
                  padding: "12px",
                  color: "white",
                },
              }}
            >
              📧 Email: {admin.email}
            </Typography>
          </Box>
        )}

        {admin?.addedFutsalCourts?.length > 0 && (
          <Box
            sx={{
              width: "85%",
              marginTop: 4,
              padding: 3,
              borderRadius: 2,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(255, 102, 0, 0.7)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{ color: "#ff6600", fontWeight: "bold", fontSize: "2rem" }}
            >
              ⚽ Added Futsal Courts
            </Typography>

            <Box sx={{ margin: "auto", display: "flex", flexDirection: "column", width: "90%" }}>
              <List>
                {admin.addedFutsalCourts.map((futsalCourt, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      backgroundColor: "#ff6600",
                      color: "white",
                      textAlign: "left",
                      margin: "15px 0",
                      borderRadius: "15px",
                      padding: 3,
                      boxShadow: "0px 2px 12px rgba(255, 102, 0, 0.7)",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        backgroundColor: "#ff6600",
                        boxShadow: "0px 4px 18px rgba(255, 102, 0, 1)",
                      },
                    }}
                  >
                    <ListItemText primary={`🏆 Futsal Court: ${futsalCourt.title}`} />
                    <ListItemText
                      primary={`📅 Opening Date: ${new Date(futsalCourt.openingDate).toDateString()}`}
                    />
                    <ListItemText primary={`📜 Description: ${futsalCourt.description}`} />
                    <ListItemText primary={`📍 Locations: ${futsalCourt.locations?.join(", ")}`} />
                    <ListItemText primary={`🌐 Website: ${futsalCourt.websiteUrl}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Fragment>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminProfile;
