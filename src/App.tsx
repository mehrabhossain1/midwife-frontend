import { Link } from "react-router-dom";

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Welcome to Projonmo Foundation 👋
        </h1>
        <p className="mb-6 text-gray-600">
          To access our platform, you need to register first. After
          registration, an admin will review your request and grant access
          within <strong>24 hours</strong>. Once verified, you will receive a
          confirmation email. After getting the email, you can proceed to{" "}
          <strong>
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </strong>
          .
        </p>
        <div className="space-y-2 flex flex-col">
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
      </div>
    </div>
  );
}

export default App;
