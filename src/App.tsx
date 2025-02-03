import { Link } from "react-router-dom";

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Welcome 👋
        </h1>
        <div className="space-y-4">
          <Link to="/register">
            <button className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
