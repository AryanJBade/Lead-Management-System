import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

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

                    <Link
                        to="/create-lead"
                        className="btn btn-outline-light me-2"
                    >
                        Create Lead
                    </Link>

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