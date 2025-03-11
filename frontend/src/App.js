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
import UserProfile from "./profile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminActions, userActions } from "./store";

function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

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
    <div>
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
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/booking/:id" element={<Booking />} />
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
    </div>
  );
}

export default App;
