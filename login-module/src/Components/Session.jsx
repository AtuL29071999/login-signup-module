import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Session = () => {
  const isAuthenticated = localStorage.getItem("isUser") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default Session;