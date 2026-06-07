import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function LeadDetails() {

    const { id } = useParams();

    const [lead, setLead] = useState(null);

    useEffect(() => {

        fetchLead();

    }, []);

    const fetchLead = async () => {

        try {

            const response =
                await API.get(
                    `/leads/${id}`
                );

            setLead(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    if (!lead) {

        return (
            <>
                <Navbar />
                <div className="container mt-5">
                    Loading...
                </div>
            </>
        );

    }

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <div className="card p-4">

                    <h2 className="mb-4">
                        Lead Details
                    </h2>

                    <p>
                        <strong>ID:</strong> {lead.id}
                    </p>

                    <p>
                        <strong>Name:</strong> {lead.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {lead.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {lead.phone}
                    </p>

                    <p>
                        <strong>Source:</strong> {lead.source}
                    </p>

                    <p>
                        <strong>Status:</strong> {lead.status}
                    </p>

                    <p>
                        <strong>Notes:</strong> {lead.notes}
                    </p>

                    <p>
                        <strong>Assigned To:</strong> {lead.assigned_agent || lead.assigned_to}
                    </p>

                </div>

            </div>
        </>
    );
}

export default LeadDetails;