import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly, teacherOnly, studentOnly }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (adminOnly && !user.is_lab_admin) {
    return <Navigate to="/" replace />;
  }
  if (teacherOnly && !user.is_teacher) {
    return <Navigate to="/" replace />;
  }
  if (studentOnly && user.is_teacher) {
    return <Navigate to="/teacher-dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
