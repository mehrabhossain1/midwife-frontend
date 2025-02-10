/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Get current location using browser geolocation API
  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject("Geolocation not available");
      }
    });
  };

  // Update onSubmit function to include the location object
  const onSubmit = async (data: any) => {
    try {
      const location = await getCurrentLocation();
      // Now, `location` is an object with lat and lng
      const updatedData = { ...data, location };

      const res = await axios.post(
        "https://midwife-backend.vercel.app/api/v1/register",
        updatedData
      );
      toast.success("Registration successful!");
      setMessage(res.data.message);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Something went wrong!");
      } else {
        setMessage("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.name?.message && (
            <p className="text-red-600 text-sm">
              {String(errors.name.message)}
            </p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: /^\S+@\S+$/i,
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">
              {String(errors.email.message)}
            </p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">
              {String(errors.password.message)}
            </p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {String(errors.confirmPassword.message)}
            </p>
          )}
          {/* Designation */}
          <input
            type="text"
            placeholder="Designation"
            {...register("designation", {
              required: "Designation is required",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.designation && (
            <p className="text-red-600 text-sm">
              {String(errors.designation.message)}
            </p>
          )}
          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            {...register("location", { required: "Location is required" })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.location?.message && (
            <p className="text-red-600 text-sm">
              {String(errors.location.message)}
            </p>
          )}

          {/* Institution */}
          <input
            type="text"
            placeholder="Institution"
            {...register("institution", {
              required: "Institution is required",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.institution && (
            <p className="text-red-600 text-sm">
              {String(errors.institution.message)}
            </p>
          )}

          {/* Mobile Number */}
          <input
            type="text"
            placeholder="Mobile Number"
            {...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: {
                value: /^\d{11}$/,
                message: "Mobile number must be 11 digits",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.mobileNumber && (
            <p className="text-red-600 text-sm">
              {String(errors.mobileNumber.message)}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
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

export default Register;
// Removed the unnecessary watch function definition
