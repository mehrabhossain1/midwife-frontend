import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export interface User {
  name: string;
  email: string;
  institution: string;
  location: {
    lat: number;
    lng: number;
  };
  mobileNumber: string;
  designation: string;
  isVerified: boolean;
  isBlocked?: boolean; // New field for blocked users
  role: string;
}
export interface Report {
  _id: string;
  name: string;
  mobileNumber: string;
  address: string;
  cause?: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  isSolved: boolean;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://midwife-backend.vercel.app/api/v1/admin/users"
        );
        const allUsers: User[] = res.data.users || [];

        const adminUser =
          allUsers.find((user) => user.role === "admin") || null;
        setAdmin(adminUser);

        setUsers(allUsers.filter((user) => user.role !== "admin"));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const verifyUser = async (email: string) => {
    try {
      await axios.patch(
        `https://midwife-backend.vercel.app/api/v1/admin/verify-user/${email}`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isVerified: true } : user
        )
      );
      toast.success("User verified successfully!");
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const declineUser = async (email: string) => {
    try {
      const response = await axios.delete(
        `https://midwife-backend.vercel.app/api/v1/admin/users`,
        {
          data: { email },
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== email)
        );
        toast.success("User declined successfully!");
      } else {
        console.error("Failed to decline user:", response.data.message);
      }
    } catch (error) {
      console.error("Error declining user:", error);
    }
  };

  const toggleBlockUser = async (
    email: string,
    isCurrentlyBlocked: boolean
  ) => {
    try {
      const response = await axios.patch(
        `https://midwife-backend.vercel.app/api/v1/admin/block-user/${email}`,
        {
          isBlocked: !isCurrentlyBlocked,
          isVerified: !isCurrentlyBlocked, // If blocking, set isVerified to false
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email
              ? {
                  ...user,
                  isBlocked: !isCurrentlyBlocked,
                  isVerified: !isCurrentlyBlocked,
                }
              : user
          )
        );

        // 🔥 If the blocked user is currently logged in, log them out
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.email === email && !isCurrentlyBlocked) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("isVerified");
          localStorage.removeItem("isBlocked");
          window.location.href = "/login"; // Redirect to login
        }

        toast.success(
          !isCurrentlyBlocked ? "User put on hold!" : "User unblocked!"
        );
      } else {
        toast.error("Failed to update user status!");
      }
    } catch (error) {
      console.error("Error updating user block status:", error);
      toast.error("Something went wrong!");
    }
  };

  const deleteUser = async (email: string) => {
    try {
      const response = await axios.delete(
        `https://midwife-backend.vercel.app/api/v1/admin/users`,
        {
          data: { email },
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== email)
        );
        toast.success("User deleted successfully!");
      } else {
        console.error("Failed to delete user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "https://midwife-backend.vercel.app/api/v1/reports"
        );
        setReports(res.data.allReports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const pendingUsers = users.filter((user) => !user.isVerified);
  const verifiedUsers = users.filter((user) => user.isVerified);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            ⬅ Back to Home
          </Link>
        </div>

        {/* Admin Info */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Admin Dashboard
          </h2>
          {admin ? (
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">
                {admin.name}
              </p>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
          ) : (
            <p className="text-red-500">No admin found!</p>
          )}
        </div>

        {/* Pending Users Table */}
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          Pending Users
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Designation</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.email} className="border-b bg-white">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.mobileNumber}</td>
                  <td className="px-4 py-3">{user?.designation}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${user.location.lat},${user.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      View Location
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => verifyUser(user.email)}
                      className="mr-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineUser(user.email)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verified Users Table */}
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          Verified Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedUsers.map((user) => (
                <tr key={user.email} className="border-b bg-white">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    {user.isBlocked ? "⛔ Blocked" : "✅ Active"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${user.location.lat},${user.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      View Location
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        toggleBlockUser(user.email, user.isBlocked ?? false)
                      }
                      className={`mr-2 rounded px-3 py-1 text-white ${
                        user.isBlocked
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Hold"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.email)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reports Table */}
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Reports</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Cause</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Reported At</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id} className="border-b bg-white">
                    <td className="px-4 py-3">{report.name}</td>
                    <td className="px-4 py-3">{report.mobileNumber}</td>
                    <td className="px-4 py-3">{report.address}</td>
                    <td className="px-4 py-3">{report.cause || "N/A"}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${report.location.lat},${report.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        View Location
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-3 text-gray-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
