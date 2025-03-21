import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  getUserDetails,
  updateUserProfile
} from "../api-helpers/api-helpers";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tournaments, setTournaments] = useState([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
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

        const userRes = await getUserDetails();
        setUser(userRes?.user || null);

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

  useEffect(() => {
    const fetchTournaments = async () => {
      if (activeTab === 1) {
        try {
          setTournamentsLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/tournaments/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setTournaments(response.data);
        } catch (err) {
          console.error('Error fetching tournaments:', err);
        } finally {
          setTournamentsLoading(false);
        }
      }
    };

    fetchTournaments();
  }, [activeTab]);

  const handleCreateTournament = () => {
    navigate('/create-tournament');
  };

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#2196f3';
      case 'in_progress':
        return '#4caf50';
      case 'completed':
        return '#9e9e9e';
      case 'closed':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Profile" />
            <Tab label="Tournaments" icon={<EmojiEventsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
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
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTournament}
                startIcon={<EmojiEventsIcon />}
              >
                Create Tournament
              </Button>
            </Box>

            {tournamentsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : tournaments.length === 0 ? (
              <Typography variant="h6" align="center" color="textSecondary" py={4}>
                You haven't registered for any tournaments yet
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {tournaments.map((tournament) => {
                  const registration = tournament.registrations.find(
                    reg => reg.userId === localStorage.getItem('userId')
                  );

                  return (
                    <Grid item xs={12} key={tournament._id}>
                      <Card
                        sx={{
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="h2" sx={{ color: '#ff5722' }}>
                              {tournament.name}
                            </Typography>
                            <Chip
                              label={tournament.status.toUpperCase()}
                              sx={{
                                bgcolor: getStatusColor(tournament.status),
                                color: 'white'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {tournament.description}
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Registration Details:
                                </Typography>
                                <Typography variant="body2">
                                  Team Name: {registration?.teamName}
                                </Typography>
                                <Typography variant="body2">
                                  Captain: {registration?.captainName}
                                </Typography>
                                <Typography variant="body2">
                                  Players: {registration?.playerCount}
                                </Typography>
                                <Typography variant="body2">
                                  Registration Date: {new Date(registration?.registrationDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Tournament Info:
                                </Typography>
                                <Typography variant="body2">
                                  Start: {new Date(tournament.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  End: {new Date(tournament.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  Prize Pool: Rs. {tournament.prizePool}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
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
                  width: 200,
                  height: 200,
                  border: '1px dashed grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  mb: 2
                }}
              >
                <Avatar
                  src={previewImage || user.profileImage}
                  sx={{ width: '100%', height: '100%' }}
                />
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
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
