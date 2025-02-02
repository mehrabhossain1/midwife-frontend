import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roleRequired: string;
}

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isVerified = localStorage.getItem("isVerified") === "true";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roleRequired === "admin" && userRole !== "admin") {
    return <Navigate to="/" />;
  }

  if (roleRequired === "verifiedUser" && !isVerified) {
    return <Navigate to="/not-verified" />;
  }

  return children;
};

export default ProtectedRoute;
