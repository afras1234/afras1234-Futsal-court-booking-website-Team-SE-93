import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
  Rating,
  Chip,
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
    const requiredFields = ["title", "image", "location", "openingDate", "description", "websiteUrl"];
    
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

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if (!urlPattern.test(inputs.websiteUrl)) {
      alert("Please enter a valid website URL.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const payload = {
      title: inputs.title.trim(),
      image: inputs.image.trim(),
      price: parseFloat(inputs.price),
      rating: parseFloat(inputs.rating) || 0,
      location: inputs.location.trim(),
      isNew: Boolean(inputs.isNew),
      facilities: Array.isArray(inputs.facilities) ? inputs.facilities : [],
      openingDate: new Date(inputs.openingDate).toISOString().split("T")[0],
      description: inputs.description.trim(),
      websiteUrl: inputs.websiteUrl.trim(),
      featured: Boolean(inputs.featured)
    };

    try {
      const response = await addFutsalCourt(payload);
      console.log("Success:", response);
      alert("Futsal court added successfully!");
      // Reset form after successful submission
      setInputs({
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
      alert(err.response?.data?.message || "Error adding futsal court. Please try again.");
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

            {["title", "image", "price", "location", "websiteUrl"].map((field) => (
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
                  type={field === "price" ? "number" : "text"}
                  inputProps={field === "price" ? { min: 0, step: "0.01" } : {}}
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
                placeholder="Add facility and click Add"
              />
              <Button
                onClick={addFacility}
                sx={{ 
                  background: "#FF4500", 
                  color: "white", 
                  marginLeft: "10px",
                  '&:hover': {
                    background: "#FF6347"
                  }
                }}
              >
                Add
              </Button>
            </Box>

            {inputs.facilities.length > 0 && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Added Facilities:</Typography>
                {inputs.facilities.map((fac, index) => (
                  <Chip
                    key={index}
                    label={fac}
                    onDelete={() => {
                      setInputs(prev => ({
                        ...prev,
                        facilities: prev.facilities.filter((_, i) => i !== index)
                      }))
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormLabel sx={labelProps}>Is New</FormLabel>
              <Checkbox 
                name="isNew" 
                checked={inputs.isNew} 
                onChange={handleChange} 
                sx={{ color: "#FF4500" }} 
              />

              <FormLabel sx={labelProps}>Featured</FormLabel>
              <Checkbox 
                name="featured" 
                checked={inputs.featured} 
                onChange={handleChange} 
                sx={{ color: "#FF4500" }} 
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                background: "#FF4500",
                color: "white",
                padding: "12px",
                '&:hover': {
                  background: "#FF6347"
                }
              }}
            >
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
