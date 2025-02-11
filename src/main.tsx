// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotVerified from "./pages/NotVerified.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./pages/Profile.tsx";
import ReportForm from "./components/ReportForm.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/not-verified" element={<NotVerified />} />

        {/* Restrict dashboard to only super admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Restrict other pages for verified users only */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roleRequired="verifiedUser">
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    {/* </StrictMode> */}
  </>
);
