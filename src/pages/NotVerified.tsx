import { Link } from "react-router-dom";

const NotVerified = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-semibold text-red-600 mb-4">
          You are not verified
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Please wait for admin verification. This usually takes 24 hours.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white text-lg font-medium rounded-md px-6 py-2 hover:bg-blue-600 transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotVerified;
