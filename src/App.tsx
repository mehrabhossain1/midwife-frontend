import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link to="/register">
        <button>Register</button>
      </Link>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default App;
