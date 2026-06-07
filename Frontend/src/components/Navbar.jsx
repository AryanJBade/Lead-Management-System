import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { isManagerOrAdmin } from "../utils/auth";

function Navbar() {

    const navigate = useNavigate();

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
            try {
                await API.post("/auth/logout", { token: refreshToken });
            } catch (error) {
                console.error("Logout API failed", error);
            }
        }

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        navigate("/");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link
                    className="navbar-brand"
                    to="/dashboard"
                >
                    Lead Management
                </Link>

                <div>

                    <Link
                        to="/dashboard"
                        className="btn btn-outline-light me-2"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/leads"
                        className="btn btn-outline-light me-2"
                    >
                        Leads
                    </Link>

                    {isManagerOrAdmin() && (
                        <Link
                            to="/create-lead"
                            className="btn btn-outline-light me-2"
                        >
                            Create Lead
                        </Link>
                    )}

                    {isManagerOrAdmin() && (
                        <Link
                            to="/logs"
                            className="btn btn-outline-light me-2"
                        >
                            Activity Logs
                        </Link>
                    )}

                    <button
                        className="btn btn-danger"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;