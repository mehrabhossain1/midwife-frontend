/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getUserLocation = async () => {
    return new Promise<{ latitude: number; longitude: number } | null>(
      (resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error getting location:", error);
              resolve(null); // Resolve with null if there's an error
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          resolve(null);
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get user's location before submitting the login form
    const location = await getUserLocation();
    if (!location) {
      setMessage("Could not retrieve location. Please try again.");
      return;
    }

    try {
      const res = await axios.post(
        "https://midwife-backend.vercel.app/api/v1/login",
        {
          ...formData,
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );
      toast.success("Login successful!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("isVerified", res.data.isVerified);

      if (res.data.role === "admin") {
        navigate("/dashboard"); // Super admin navigates to dashboard
      } else if (!res.data.isVerified) {
        navigate("/not-verified"); // Unverified user
      } else {
        navigate("/profile"); // Verified user navigates to profile
      }
    } catch (err) {
      setMessage(
        (err as any).response?.data?.message || "Invalid credentials!"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
