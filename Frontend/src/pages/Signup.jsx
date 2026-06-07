import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Signup successful. Please login.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        (error.message === "Network Error"
          ? "Cannot reach the backend. Make sure the server is running on port 5000."
          : error.message);
      alert(message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4">
            <h3 className="text-center mb-3">Signup</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select
                className="form-select mb-3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="agent">Agent</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>

              <button className="btn btn-primary w-100" type="submit">
                Create Account
              </button>
            </form>

            <div className="text-center mt-3">
              Already have an account? <Link to="/">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
