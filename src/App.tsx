import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "./pages/Dashboard";
import axios from "axios";
import Logo from "../public/logo.jpg";
import UserMap from "./components/UserMap";

function App() {
  const [last30MinutesUsers, setLast30MinutesUsers] = useState<User[]>([]);
  const [last24HoursUsers, setLast24HoursUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/admin/recent-users"
        );
        setLast30MinutesUsers(res.data.last30MinutesUsers);
        setLast24HoursUsers(res.data.last24HoursUsers);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchRecentUsers();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="space-x-2 flex">
        <Link to="/register">
          <button className="w-full cursor-pointer rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Register
          </button>
        </Link>
        <Link to="/login">
          <button className="w-full cursor-pointer rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Login
          </button>
        </Link>
      </div>

      <div className=" bg-white flex flex-col items-center p-4">
        {/* Header Image */}
        <img
          src={Logo} // Replace with actual image URL
          alt="Pregnancy Health"
          className="w-64 mb-4"
        />

        <h2 className="text-xl font-semibold text-gray-900 text-center">
          গর্ভবতী মায়ের সুস্থতার জন্য
        </h2>

        {/* 30 Minutes Report */}
        <div className="mt-4 text-center">
          <p className="text-5xl font-bold text-gray-900">
            {last30MinutesUsers.length}
          </p>
          <p className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
            গত ৩০ মিনিটে করা মোট রিপোর্ট
          </p>
        </div>

        {/* 24 Hours Report */}
        <div className="mt-4 text-center">
          <p className="text-5xl font-bold text-gray-900">
            {last24HoursUsers.length}
          </p>
          <p className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
            গত ২৪ ঘণ্টায় করা মোট রিপোর্ট
          </p>
        </div>

        {/* Report Button */}
        <Link to="/report">
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md text-lg cursor-pointer">
            রিপোর্ট করুন →
          </button>
        </Link>

        <UserMap users={last30MinutesUsers} />

        {/* Footer */}
        <footer className="mt-8 text-sm text-gray-600 text-center">
          <p>
            This site is developed under collaboration with eXhort and Projonmo
            Research Foundation Bangladesh to help pregnant women in emergency.
          </p>
          <p className="mt-2 text-xs">WhatsApp | সাহায্য প্রয়োজন</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
