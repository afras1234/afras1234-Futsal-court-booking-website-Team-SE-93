import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    console.error("No Data", err);
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

    console.log('Auth response:', res.data);
    
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Failed to authenticate");
    }

    const resData = res.data;
    if (resData.token) {
      localStorage.setItem("token", resData.token);
    }
    localStorage.setItem("userId", resData.id);

    return resData;
  } catch (err) {
    console.error("Error in authentication:", err);
    throw err;
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await API.post("/admin/login", {
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.error("Unexpected Error", err);
  }
};

export const getFutsalCourtDetails = async (id) => {
  try {
    const res = await API.get(`/futsalCourt/${id}`);
    return res.data;
  } catch (err) {
    console.error("Unexpected Error", err);
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
    console.error("Unexpected Error", err);
  }
};

export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await API.get(`/user/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Unexpected Error", err);
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await API.delete(`/booking/${id}`);
    return res.data;
  } catch (err) {
    console.error("Unexpected Error", err);
  }
};

export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await API.get(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Unexpected Error", err);
  }
};

export const addFutsalCourt = async (data) => {
  try {
    const res = await API.post(
      "/futsalCourt",
      {
        title: data.title,
        description: data.description,
        openingDate: data.openingDate,
        websiteUrl: data.websiteUrl,
        featured: data.featured,
        locations: data.locations,
        admin: localStorage.getItem("adminId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Unexpected Error Occurred", err);
  }
};

export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    const res = await API.get(`/admin/${adminId}`);
    return res.data;
  } catch (err) {
    console.error("Unexpected Error Occurred", err);
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
      throw new Error("Failed to update profile");
    }
    return res.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};
