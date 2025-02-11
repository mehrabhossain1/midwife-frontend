import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Report } from "./pages/Dashboard";
import axios from "axios";
import Logo from "../public/logo.jpg";

function App() {
  const [last24HoursReports, setLast24HoursReports] = useState<Report[]>([]);
  const [allReportsCount, setAllReportsCount] = useState(0);
  // console.log(allReportsCount);

  const fetchRecentReports = async () => {
    try {
      const res = await axios.get(
        "https://midwife-backend.vercel.app/api/v1/reports"
      );

      setLast24HoursReports(res.data.last24HoursReports);
      setAllReportsCount(res.data.allReportsCount);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchRecentReports();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      {/* Centered Content */}
      <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-lg">
        {/* Header Image */}
        <img src={Logo} alt="Pregnancy Health" className="w-48 mx-auto mb-4" />

        <h2 className="text-xl font-semibold text-gray-900">
          গর্ভবতী মায়ের সুস্থতার জন্য
        </h2>

        {/* Reports Section */}
        <div className="mt-6 space-y-4">
          {/* 30 Minutes Report */}
          <div className="bg-green-100 p-4 rounded-md">
            <p className="text-4xl font-bold text-gray-900">
              {last24HoursReports.length}
            </p>
            <p className="mt-2 text-green-700 font-medium">
              গত ২৪ ঘণ্টায় করা মোট রিপোর্ট
            </p>
          </div>

          {/* 24 Hours Report */}
          <div className="bg-blue-100 p-4 rounded-md">
            <p className="text-4xl font-bold text-gray-900">
              {allReportsCount}
            </p>
            <p className="mt-2 text-blue-700 font-medium">মোট রিপোর্ট</p>
          </div>
        </div>

        {/* Report Button */}
        <Link to="/report">
          <button className="mt-6 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all">
            রিপোর্ট করুন →
          </button>
        </Link>

        {/* Footer */}
        <footer className="mt-8 text-sm text-gray-600">
          <p>
            This site is developed under collaboration with eXhort and Projonmo
            Research Foundation Bangladesh to help pregnant women in emergency.
          </p>
          <p className="mt-2 text-xs font-medium text-gray-700">
            WhatsApp | সাহায্য প্রয়োজন
          </p>
        </footer>
      </div>

      {/* Right-Side Buttons */}
      <div className="ml-12 flex flex-col space-y-4">
        {/* Admin Login */}
        <Link to="/login" className="flex flex-col items-center">
          <button className="w-64 cursor-pointer rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500">
            Admin Login
          </button>
          <span className="text-sm text-gray-500 mt-1">
            For administrator use only
          </span>
        </Link>

        {/* Login & Signup */}
        <div className="space-y-1 flex flex-col">
          <Link to="/login">
            <button className="w-64 cursor-pointer rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="w-64 cursor-pointer rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
              Sign up
            </button>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500 mt-2">
          Only for healthcare professionals related to <br />
          <span className="font-medium text-gray-600">maternal care</span>
        </p>
      </div>
    </div>
  );
}

export default App;
