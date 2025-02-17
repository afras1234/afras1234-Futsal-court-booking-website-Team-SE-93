import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/Auth/AuthForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FutsalCourts from "./components/FutsalCourts/FutsalCourts";
import Admin from "./components/Auth/Admin";
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

    if (userId) {
      dispatch(userActions.login());
    }
    if (adminId) {
      dispatch(adminActions.login());
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/futsalCourts" element={<FutsalCourts />} />

        {!isUserLoggedIn && !isAdminLoggedIn && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:email" element={<ResetPassword />} />
          </>
        )}

        {isUserLoggedIn && (
          <>
            <Route path="/user" element={<UserProfile />} />
            <Route path="/booking/:id" element={<Booking />} />
          </>
        )}

        {isAdminLoggedIn && (
          <>
            <Route path="/add" element={<AddFutsalCourt />} />
            <Route path="/user-admin" element={<AdminProfile />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
