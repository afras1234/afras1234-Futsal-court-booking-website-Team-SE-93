import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers";
import { adminActions } from "../../store";
import AuthForm from "./AuthForm";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onResReceived = (data) => {
    if (data && data.id && data.token) {
      console.log("Admin Response:", data);
      dispatch(adminActions.login());
      localStorage.setItem("adminId", data.id);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      console.log("Invalid response received from server.");
    }
  };

  const getData = (data) => {
    console.log("Admin Data Submitted:", data);
    sendAdminAuthRequest(data.inputs)
      .then(onResReceived)
      .catch((err) => console.log("Error during admin authentication:", err));
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={true} />
    </div>
  );
};

export default Admin;
