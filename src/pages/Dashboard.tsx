import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  interface User {
    email: string;
    isVerified: boolean;
  }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/admin/users")
      .then((res) => {
        setUsers(res.data.users || []); // Ensure it's always an array
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const verifyUser = async (email: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/admin/verify-user/${email}`
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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.email}>
            {user.email} - {user.isVerified ? "Verified ✅" : "Pending ⏳"}
            {!user.isVerified && (
              <button onClick={() => verifyUser(user.email)}>Verify</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
