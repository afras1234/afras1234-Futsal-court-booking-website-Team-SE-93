import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addFutsalCourt } from "../../api-helpers/api-helpers";

const labelProps = {
  mt: 1,
  mb: 1,
  fontWeight: "bold",
  color: "#FF8C00", // Orange color for labels
};

const AddFutsalCourt = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    websiteUrl: "",
    openingDate: "",
    locations: "",
    featured: false,
  });

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, locations);
    addFutsalCourt({ ...inputs, locations })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg,rgb(32, 22, 19),rgb(235, 157, 129))", // Orange gradient
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            width: "450px",
            padding: "30px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0px 8px 20px rgba(255, 140, 0, 0.3)", // Orange shadow effect
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#FF4500", // Bold red-orange
              marginBottom: "20px",
              borderBottom: "3px solid #FF8C00",
              display: "inline-block",
            }}
          >
            Add New Futsal Court
          </Typography>

          <FormLabel sx={labelProps}>Title</FormLabel>
          <TextField
            value={inputs.title}
            onChange={handleChange}
            name="title"
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <FormLabel sx={labelProps}>Description</FormLabel>
          <TextField
            value={inputs.description}
            onChange={handleChange}
            name="description"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={2}
          />

          <FormLabel sx={labelProps}>Website URL</FormLabel>
          <TextField
            value={inputs.websiteUrl}
            onChange={handleChange}
            name="websiteUrl"
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <FormLabel sx={labelProps}>Opening Date</FormLabel>
          <TextField
            type="date"
            value={inputs.openingDate}
            onChange={handleChange}
            name="openingDate"
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <FormLabel sx={labelProps}>Location</FormLabel>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Button
              onClick={() => {
                if (location.trim() !== "") {
                  setLocations([...locations, location]);
                  setLocation("");
                }
              }}
              sx={{
                background: "#FF4500",
                color: "white",
                marginLeft: "10px",
                ":hover": {
                  background: "#FF8C00",
                },
              }}
            >
              Add
            </Button>
          </Box>

          <FormLabel sx={labelProps}>Featured</FormLabel>
          <Checkbox
            name="featured"
            checked={inputs.featured}
            onChange={(e) =>
              setInputs((prevState) => ({
                ...prevState,
                featured: e.target.checked,
              }))
            }
            sx={{
              color: "#FF4500",
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              fontSize: "16px",
              background: "#FF4500",
              color: "white",
              fontWeight: "bold",
              ":hover": {
                background: "#FF8C00",
                transform: "scale(1.05)",
              },
            }}
          >
            Add New Futsal Court
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddFutsalCourt;
