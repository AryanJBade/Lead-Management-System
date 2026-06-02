import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";



function Dashboard() {

    const [stats, setStats] = useState({
        totalLeads: 0,
        totalAgents: 0,
        totalManagers: 0
    });

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response =
                await API.get("/dashboard");

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h1 className="mb-4">
                Dashboard
            </h1>

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
                
                <Link
                    to="/create-lead"
                    className="btn btn-success me-2"
                >
                    Create Lead
                </Link>

                <Link
                    to="/leads"
                    className="btn btn-primary"
                >
                    View Leads
                </Link>

            </div>

        </div>

    );
}

export default Dashboard;