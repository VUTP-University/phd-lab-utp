import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children ,adminOnly}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  if (!user) {
    return <Navigate to="/" replace/>;
  }
  if (!user.is_lab_admin&&adminOnly){
    return <Navigate to="/" replace/>
  }

  return children;
}

export default ProtectedRoute;