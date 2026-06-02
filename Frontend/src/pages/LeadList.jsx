import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function LeadList() {

    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchLeads();

    }, []);

    const fetchLeads = async (searchText = "") => {

        try {

            const response =
                await API.get(
                    `/leads?search=${searchText}`
                );

            setLeads(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteLead = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this lead?"
            );

        if (!confirmDelete) return;

        try {

            await API.delete(
                `/leads/${id}`
            );

            fetchLeads(search);

        } catch (error) {

            console.log(error);

        }

    };

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        fetchLeads(value);

    };

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <div className="d-flex justify-content-between mb-3">

                    <h2>
                        Lead List
                    </h2>

                    <Link
                        to="/create-lead"
                        className="btn btn-success"
                    >
                        Create Lead
                    </Link>

                </div>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search Lead By Name"
                    value={search}
                    onChange={handleSearch}
                />

                <table className="table table-bordered table-striped">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            leads.map((lead) => (

                                <tr key={lead.id}>

                                    <td>{lead.id}</td>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td>{lead.status}</td>

                                    <td>

                                        <Link
                                            to={`/edit-lead/${lead.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteLead(
                                                    lead.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </>
    );
}

export default LeadList;