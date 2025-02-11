import UserMap from "../components/UserMap";

const Profile = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-6 px-4">
      <UserMap />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-4xl font-semibold text-green-600">
          Congratulations!
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Your account has been successfully verified.
        </p>
        <div className="mt-6">
          <div className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-full inline-block">
            Verified ✅
          </div>
        </div>
        <p className="mt-4 text-gray-500">
          You can now access all features of your profile.
        </p>
      </div>
    </div>
  );
};

export default Profile;
