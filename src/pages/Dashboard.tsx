import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  interface User {
    name: string;
    email: string;
    institution: string;
    location: string;
    mobileNumber: string;
    isVerified: boolean;
    role: string; // To differentiate admin from users
  }

  const [users, setUsers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://midwife-backend.vercel.app/api/v1/admin/users"
        );
        const allUsers: User[] = res.data.users || [];

        // Find admin from the list
        const adminUser =
          allUsers.find((user) => user.role === "admin") || null;
        setAdmin(adminUser);

        // Filter out users (exclude admins)
        const filteredUsers = allUsers.filter((user) => user.role !== "admin");
        setUsers(filteredUsers);

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
      setUsers(
        users.map((user) =>
          user.email === email ? { ...user, isVerified: true } : user
        )
      );
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-lg">
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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Institution</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Mobile Number</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.email}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b`}
                >
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.institution}</td>
                  <td className="px-4 py-3">{user.location}</td>
                  <td className="px-4 py-3">{user.mobileNumber}</td>
                  <td className="px-4 py-3 text-center">
                    {user.isVerified ? "✅ Verified" : "⏳ Pending"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!user.isVerified && (
                      <button
                        onClick={() => verifyUser(user.email)}
                        className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
