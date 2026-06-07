import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await API.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );

            localStorage.setItem(
                "token",
                response.data.token
            );
            localStorage.setItem(
                "refreshToken",
                response.data.refreshToken
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                error.message
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card p-4">

                        <h3 className="text-center">
                            Login
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                className="btn btn-primary w-100"
                            >
                                Login
                            </button>

                        </form>

                        <div className="text-center mt-3">
                            Don't have an account? <Link to="/signup">Signup</Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;