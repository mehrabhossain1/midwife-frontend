import { Navigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roleRequired: string;
}

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isVerified = localStorage.getItem("isVerified") === "true";
  const isBlocked = localStorage.getItem("isBlocked") === "true"; // 🔥 Check isBlocked status

  useEffect(() => {
    if (isBlocked) {
      // 🔥 If blocked, log out and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("isVerified");
      localStorage.removeItem("isBlocked");
      window.location.href = "/login"; // Redirect to login
    }
  }, [isBlocked]);

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
