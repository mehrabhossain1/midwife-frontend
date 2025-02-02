import { Link } from "react-router-dom";

const NotVerified = () => {
  return (
    <div>
      <h2>You are not verified</h2>
      <p>Please wait for admin verification. This usually takes 24 hours.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default NotVerified;
