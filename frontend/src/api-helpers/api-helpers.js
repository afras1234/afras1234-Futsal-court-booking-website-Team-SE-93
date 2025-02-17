import axios from "axios";
const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // Ensures credentials are sent
});

// Password Reset Request (Sends Email)
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch("http://localhost:5000/api/user/request-password-reset", {  // Make sure the route is correct
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Failed to request password reset");

    return await response.json();
  } catch (error) {
    console.error("Error in Password Reset Request:", error.message);
  }
};


// Reset Password Confirmation
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await API.post("/user/reset-password", { email, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in Reset Password:", error.response?.data || error.message);
  }
};




export const getAllFutsalCourts = async () => {
  try {
    const res = await API.get("/futsalCourt"); // Use API instance instead of axios
    return res.data || { futsalCourts: [] }; // Ensure futsalCourts is always an array
  } catch (err) {
    console.error("No Data", err);
    return { futsalCourts: [] }; // Return a default value
  }
};


export const sendUserAuthRequest = async (data, signup) => {
  try {
    const res = await API.post(`/user/${signup ? "signup" : "login"}`, {

      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.log("Unexpected Error Occurred", err);
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await axios.post("/admin/login", {
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const getFutsalCourtDetails = async (id) => {
  try {
    const res = await axios.get(`/futsalCourt/${id}`);
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      futsalCourt: data.futsalCourt,
      timeSlot: data.timeSlot,
      date: data.date,
      user: localStorage.getItem("userId"),
    });
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.log("Unexpected Error", err);
  }
};

export const addFutsalCourt = async (data) => {
  try {
    const res = await axios.post(
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
    console.log("Unexpected Error Occurred", err);
  }
};

export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    const res = await axios.get(`/admin/${adminId}`);
    return res.data;
  } catch (err) {
    console.log("Unexpected Error Occurred", err);
  }
};
