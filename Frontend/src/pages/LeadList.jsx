import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { isManagerOrAdmin } from "../utils/auth";

function LeadList() {

    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 5, pages: 1, total: 0 });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async (options = {}) => {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.append("page", options.page || pagination.page);
        params.append("limit", pagination.limit);

        if (options.search !== undefined) {
            params.append("search", options.search);
        } else if (search) {
            params.append("search", search);
        }

        if (options.status !== undefined) {
            params.append("status", options.status);
        } else if (statusFilter) {
            params.append("status", statusFilter);
        }

        if (options.source !== undefined) {
            params.append("source", options.source);
        } else if (sourceFilter) {
            params.append("source", sourceFilter);
        }

        params.append("sortBy", options.sortBy || sortBy);
        params.append("sortOrder", options.sortOrder || sortOrder);

        try {
            const response = await API.get(`/leads?${params.toString()}`);
            setLeads(response.data.leads || []);
            setPagination(response.data.pagination || pagination);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load leads");
        } finally {
            setLoading(false);
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
            alert(
                error?.response?.data?.message ||
                "Error deleting lead"
            );

        }

    };

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        fetchLeads({ search: value, page: 1 });

    };

    const handleFilterChange = ({
        search: newSearch = search,
        status: newStatus = statusFilter,
        source: newSource = sourceFilter,
        sortBy: newSortBy = sortBy,
        sortOrder: newSortOrder = sortOrder,
        page = 1
    } = {}) => {
        fetchLeads({
            search: newSearch,
            status: newStatus,
            source: newSource,
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            page
        });
    };

    const handlePageChange = (newPage) => {
        fetchLeads({
            page: newPage,
            search,
            status: statusFilter,
            source: sourceFilter,
            sortBy,
            sortOrder
        });
    };

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <div className="d-flex justify-content-between mb-3">

                    <h2>
                        Lead List
                    </h2>

                    {isManagerOrAdmin() && (
                        <Link
                            to="/create-lead"
                            className="btn btn-success"
                        >
                            Create Lead
                        </Link>
                    )}

                </div>

                <div className="row g-3 mb-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Lead By Name"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatusFilter(value);
                                handleFilterChange({ status: value, page: 1 });
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Source"
                            value={sourceFilter}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSourceFilter(value);
                                handleFilterChange({ source: value, page: 1 });
                            }}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSortBy(value);
                                handleFilterChange({ sortBy: value, page: 1 });
                            }}
                        >
                            <option value="created_at">Newest</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                            <option value="source">Source</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={sortOrder}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSortOrder(value);
                                handleFilterChange({ sortOrder: value, page: 1 });
                            }}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-4">Loading leads...</div>
                ) : (
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
                            leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id || lead.lead_id}>

                                        <td>{lead.id || lead.lead_id}</td>
                                        <td>{lead.name}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.status}</td>

                                        <td>

                                            <Link
                                                to={`/lead/${lead.id || lead.lead_id}`}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                to={`/edit-lead/${lead.id || lead.lead_id}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteLead(lead.id || lead.lead_id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )
                        }

                    </tbody>

                </table>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Page {pagination.page} of {pagination.pages} • Total {pagination.total}
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary btn-sm me-2"
                            disabled={pagination.page <= 1 || loading}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={pagination.page >= pagination.pages || loading}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>

        </>
    );
}

export default LeadList;