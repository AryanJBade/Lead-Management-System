import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [searchAction, setSearchAction] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async (search = "", newPage = 1) => {
        setLoading(true);
        setError("");

        try {
            const response = await API.get(
                `/logs?action=${encodeURIComponent(search)}&page=${newPage}&limit=${pagination.limit}`
            );
            setLogs(response.data.logs || []);
            setPagination(response.data.pagination || pagination);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Unable to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchAction(value);
        fetchLogs(value, 1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.pages) return;
        setPage(newPage);
        fetchLogs(searchAction, newPage);
    };

    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Activity Logs</h2>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            value={searchAction}
                            onChange={handleSearch}
                            className="form-control"
                            placeholder="Search by action"
                        />
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center py-4">Loading logs...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Action</th>
                                    <th>Lead</th>
                                    <th>User</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No activity logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td>{log.action}</td>
                                            <td>{log.lead_name || log.lead_id || "-"}</td>
                                            <td>{log.user_name || log.user_id || "-"}</td>
                                            <td>{log.created_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Page {pagination.page} of {pagination.pages} • Total {pagination.total}
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary btn-sm me-2"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= pagination.pages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActivityLogs;
