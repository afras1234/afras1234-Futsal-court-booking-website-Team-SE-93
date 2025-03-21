import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers";
import { userActions } from "../../store";
import AuthForm from "./AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onResReceived = (data) => {
    if (!data) {
      console.error("No response from server");
      return;
    }

    // Handle both login and signup responses
    const userId = data.id;
    const token = data.token;

    if (!userId) {
      console.error("Invalid response from server:", data);
      return;
    }

    console.log("Authentication successful:", data);
    dispatch(userActions.login());
    localStorage.setItem("userId", userId);
    if (token) {
      localStorage.setItem("token", token);
    }
    // Navigate to home page without query parameters
    navigate("/", { replace: true });
  };

  const getData = async (data) => {
    try {
      console.log("Sending auth request:", data);
      const response = await sendUserAuthRequest(data.inputs, data.signup);
      onResReceived(response);
    } catch (err) {
      console.error("Authentication error:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;
