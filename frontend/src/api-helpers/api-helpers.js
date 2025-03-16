import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Password Reset Request
export const requestPasswordReset = async (email) => {
  try {
    const response = await API.post("/user/request-password-reset", { email });
    return response.data;
  } catch (error) {
    console.error("Error in Password Reset Request:", error.response?.data || error.message);
    throw error;
  }
};

// Reset Password Confirmation
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await API.post("/user/reset-password", { email, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in Reset Password:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllFutsalCourts = async () => {
  try {
    const res = await API.get("/futsalCourt"); 
    return res.data || { futsalCourts: [] }; 
  } catch (err) {
    console.error("Error fetching futsal courts:", err);
    return { futsalCourts: [] }; 
  }
};

export const sendUserAuthRequest = async (data, signup) => {
  try {
    console.log(`Sending ${signup ? 'signup' : 'login'} request with data:`, data);
    const res = await API.post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
      phone: signup ? data.phone : "",
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data?.message || "Failed to authenticate");
    }

    const resData = res.data;
    if (resData.token) {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("userId", resData.id);
    }

    return resData;
  } catch (err) {
    console.error("Error in user authentication:", err);
    throw err;
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await API.post("/admin/login", {
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to authenticate");
    }

    const resData = res.data;
    if (resData.token) {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("adminId", resData.id);
    }

    return resData;
  } catch (err) {
    console.error("Error in admin authentication:", err);
    throw err;
  }
};

export const adminSignup = async (data) => {
  try {
    const res = await API.post("/admin/signup", {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      secretKey: data.secretKey,
    });
    
    if (res.status !== 201) {
      throw new Error(res.data?.message || "Failed to signup");
    }

    const resData = res.data;
    if (resData.token) {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("adminId", resData.id);
    }
    
    return resData;
  } catch (err) {
    console.error("Error in admin signup:", err);
    throw err;
  }
};

export const getFutsalCourtDetails = async (id) => {
  try {
    const res = await API.get(`/futsalCourt/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching futsal court details:", err);
    throw err;
  }
};

export const newBooking = async (data) => {
  try {
    const res = await API.post("/booking", {
      futsalCourt: data.futsalCourt,
      timeSlot: data.timeSlot,
      date: data.date,
      user: localStorage.getItem("userId"),
    });
    return res.data;
  } catch (err) {
    console.error("Error creating booking:", err);
    throw err;
  }
};

export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await API.get(`/user/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw err;
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await API.delete(`/booking/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
    throw err;
  }
};

export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await API.get(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};

// Add New Futsal Court
export const addFutsalCourt = async (data) => {
  try {
    const formattedData = {
      id: data.id || `court-${Date.now()}`,
      title: data.title?.trim() || "Untitled Court",
      image: data.image || "https://example.com/default-futsal-image.jpg",
      price: Number(data.price) || 0,
      rating: Number(data.rating) || 0,
      location: data.location?.trim() || "Unknown Location",
      isNew: Boolean(data.isNew),
      facilities: Array.isArray(data.facilities) ? data.facilities.map(f => f.trim()) : [],
      openingDate: data.openingDate || new Date().toISOString().split("T")[0],
      description: data.description?.trim() || "No description available.",
      websiteUrl: data.websiteUrl || "",
      featured: Boolean(data.featured),
      admin: localStorage.getItem("adminId"),
    };
    console.log("Submitting Futsal Court:", formattedData);
    const res = await API.post("/futsalCourt", formattedData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    const res = await API.get(`/admin/${adminId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching admin details:", err);
    throw err;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update profile");
    }
    return res.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

// Tournament related API functions
export const createTournament = async (tournamentData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/tournaments", tournamentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 201) {
      throw new Error(res.data?.message || "Failed to create tournament");
    }
    return res.data;
  } catch (err) {
    console.error("Error creating tournament:", err);
    throw err;
  }
};

export const updateTournament = async (id, tournamentData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/tournaments/${id}`, tournamentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update tournament");
    }
    return res.data;
  } catch (err) {
    console.error("Error updating tournament:", err);
    throw err;
  }
};

export const getUserTournaments = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/tournaments/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch tournaments");
    }
    return res.data;
  } catch (err) {
    console.error("Error fetching user tournaments:", err);
    throw err;
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 8eda37c6db0fc528a3f7ab46ea7cc396e6b40768
