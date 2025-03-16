import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import React, { useState } from "react";
import { addFutsalCourt } from "../../api-helpers/api-helpers";
import Footer from "../../components/Footer";

const labelProps = {
  mt: 1,
  mb: 1,
  fontWeight: "bold",
  color: "#FF8C00",
};

const AddFutsalCourt = () => {
  const [inputs, setInputs] = useState({
    id: "",
    title: "",
    image: "",
    price: "",
    rating: 0,
    location: "",
    isNew: false,
    facilities: [],
    openingDate: "",
    description: "",
    websiteUrl: "",
    featured: false,
  });

  const [facility, setFacility] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFacility = () => {
    if (facility.trim()) {
      setInputs((prevState) => ({
        ...prevState,
        facilities: [...prevState.facilities, facility.trim()],
      }));
      setFacility("");
    }
  };

  const validateInputs = () => {
    const requiredFields = ["id", "title", "image", "location", "openingDate", "description"];
    
    for (const field of requiredFields) {
      if (!inputs[field].trim()) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return false;
      }
    }
    
    if (!inputs.price || isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      alert("Price must be a positive number.");
      return false;
    }
    
    if (inputs.rating < 0 || inputs.rating > 5) {
      alert("Rating must be between 0 and 5.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const payload = {
      ...inputs,
      price: parseFloat(inputs.price),
      rating: parseFloat(inputs.rating) || 0,
      isNew: Boolean(inputs.isNew),
      featured: Boolean(inputs.featured),
      facilities: Array.isArray(inputs.facilities) ? inputs.facilities : [],
      openingDate: new Date(inputs.openingDate).toISOString().split("T")[0],
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await addFutsalCourt(payload);
      console.log("Success:", response);
      alert("Futsal court added successfully!");
      // Reset form after successful submission
      setInputs({
        id: "",
        title: "",
        image: "",
        price: "",
        rating: 0,
        location: "",
        isNew: false,
        facilities: [],
        openingDate: "",
        description: "",
        websiteUrl: "",
        featured: false,
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error adding futsal court. Check the console for details.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, rgb(32, 22, 19), rgb(235, 157, 129))",
        padding: "20px",
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
          <Box
            sx={{
              width: "100%",
              padding: "30px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0px 8px 20px rgba(255, 140, 0, 0.3)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#FF8C00",
                marginBottom: "20px",
                borderBottom: "3px solid #FF8C00",
                display: "inline-block",
              }}
            >
              Add New Futsal Court
            </Typography>

            {["id", "title", "image", "price", "location", "websiteUrl"].map((field) => (
              <Box key={field}>
                <FormLabel sx={labelProps}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </FormLabel>
                <TextField
                  value={inputs[field]}
                  onChange={handleChange}
                  name={field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                />
              </Box>
            ))}

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
              required
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
              required
            />

            <FormLabel sx={labelProps}>Rating</FormLabel>
            <Rating
              value={inputs.rating}
              onChange={(e, newValue) =>
                setInputs((prevState) => ({ ...prevState, rating: newValue }))
              }
              precision={0.5}
              size="medium"
            />

            <FormLabel sx={labelProps}>Facilities</FormLabel>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <Button
                onClick={addFacility}
                sx={{ background: "#FF4500", color: "white", marginLeft: "10px" }}
              >
                Add
              </Button>
            </Box>

            <FormLabel sx={labelProps}>Is New</FormLabel>
            <Checkbox name="isNew" checked={inputs.isNew} onChange={handleChange} sx={{ color: "#FF4500" }} />

            <FormLabel sx={labelProps}>Featured</FormLabel>
            <Checkbox name="featured" checked={inputs.featured} onChange={handleChange} sx={{ color: "#FF4500" }} />

            <Button type="submit" variant="contained" sx={{ mt: 3, width: "100%", backgroundColor: "#FF8C00", color: "white", "&:hover": { backgroundColor: "#e07b00" } }}>
              Add New Futsal Court
            </Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default AddFutsalCourt;
