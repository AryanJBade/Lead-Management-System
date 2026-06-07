import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { isManagerOrAdmin } from "../utils/auth";



function Dashboard() {

    const [stats, setStats] = useState({
        totalLeads: 0,
        totalAgents: 0,
        totalManagers: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await API.get("/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error(error);
            setError(error?.response?.data?.message || "Unable to load dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="container mt-5">

            <h1 className="mb-4">
                Dashboard
            </h1>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading dashboard...</div>
            ) : (
                <>
                    <div className="row">

                        <div className="col-md-4">

                            <div className="card text-center p-3">

                                <h5>Total Leads</h5>

                                <h2>
                                    {stats.totalLeads}
                                </h2>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card text-center p-3">

                                <h5>Total Agents</h5>

                                <h2>
                                    {stats.totalAgents}
                                </h2>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card text-center p-3">

                                <h5>Total Managers</h5>

                                <h2>
                                    {stats.totalManagers}
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="mt-4">
                        {isManagerOrAdmin() && (
                            <Link
                                to="/create-lead"
                                className="btn btn-success me-2"
                            >
                                Create Lead
                            </Link>
                        )}

                        <Link
                            to="/leads"
                            className="btn btn-primary"
                        >
                            View Leads
                        </Link>

                        {isManagerOrAdmin() && (
                            <Link
                                to="/logs"
                                className="btn btn-secondary ms-2"
                            >
                                Activity Logs
                            </Link>
                        )}
                    </div>
                </>
            )}

        </div>

    );
}

export default Dashboard;