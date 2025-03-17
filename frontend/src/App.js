import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FutsalCourts from "./components/FutsalCourts/FutsalCourts";
import Admin from "./components/Auth/Admin";
import AdminLogin from "./components/Auth/AdminLogin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Booking";
import AddFutsalCourt from "./components/FutsalCourts/AddFutsalCourt";
import AdminProfile from "./profile/AdminProfile";
import Profile from "./components/Profile";
import TournamentForm from "./components/TournamentForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { adminActions, userActions } from "./store";
import { Button } from "@mui/material";
import Chat from "./components/Chat";

function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = (state) => {
    setIsChatOpen(state !== undefined ? state : !isChatOpen);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      dispatch(userActions.login());
    }
    if (adminId && token) {
      dispatch(adminActions.login());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/futsalCourts" element={<FutsalCourts />} />

        {/* Auth routes - always accessible */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/signup" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:email" element={<ResetPassword />} />

        {/* User Protected routes */}
        {isUserLoggedIn && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/create-tournament" element={<TournamentForm />} />
            <Route path="/chat" element={<Chat />} />
          </>
        )}

        {/* Admin Protected routes */}
        {isAdminLoggedIn && (
          <>
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/add" element={<AddFutsalCourt />} />
          </>
        )}

        {/* Catch-all route */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Add the Chat component as a popup that's always available */}
      {isUserLoggedIn && <Chat isOpen={isChatOpen} toggleChat={toggleChat} />}
    </div>
  );
}

export default App;
