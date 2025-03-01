import React, { useEffect, useState } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
  updateUserProfile
} from "../api-helpers/api-helpers";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Paper,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    bio: "",
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bookingsRes, userRes] = await Promise.all([
          getUserBooking(),
          getUserDetails(),
        ]);

        setBookings(bookingsRes?.bookings?.filter(b => b && b.futsalCourt) || []);
        setUser(userRes?.user || null);
        
        // Initialize edit form with user data
        if (userRes?.user) {
          setEditForm({
            name: userRes.user.name || "",
            phone: userRes.user.phone || "",
            bio: userRes.user.bio || "",
            profileImage: null
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setPreviewImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditForm({ ...editForm, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("phone", editForm.phone);
      formData.append("bio", editForm.bio);
      if (editForm.profileImage) {
        formData.append("profileImage", editForm.profileImage);
      }

      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser.user);
      setEditDialogOpen(false);
      setPreviewImage(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedBookingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBooking(selectedBookingId);
      setBookings((prev) => prev.filter((booking) => booking._id !== selectedBookingId));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Failed to delete booking. Please try again.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <Typography>No user data found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar
              src={user.profileImage}
              sx={{ width: 100, height: 100, mr: 2 }}
            />
            <Box>
              <Typography variant="h5">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              {user.phone && (
                <Typography color="textSecondary">{user.phone}</Typography>
              )}
              {user.bio && (
                <Typography sx={{ mt: 1 }}>{user.bio}</Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-input"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image-input">
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: '1px dashed grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  cursor: 'pointer'
                }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography>Click to upload image</Typography>
                )}
              </Box>
            </label>
            <TextField
              fullWidth
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bookings Section */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Your Bookings
      </Typography>

      <Grid container spacing={3}>
        {bookings.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No bookings found. Book a futsal court to get started!
              </Typography>
            </Paper>
          </Grid>
        ) : (
          bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {booking.futsalCourt.title}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteClick(booking._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography color="textSecondary" gutterBottom>
                    Date: {format(new Date(booking.date), "PPP")}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Time: {booking.timeSlot}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={booking.status || "Confirmed"}
                      color={booking.status === "cancelled" ? "error" : "success"}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this booking? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
