import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LeadForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        notes: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            await API.post(
                "/leads",
                formData
            );

            alert(
                "Lead Created Successfully"
            );

            navigate("/leads");

        } catch (error) {

            console.log(error);
            setError(error?.response?.data?.message || "Error Creating Lead");

        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="container mt-5">

            <div className="card p-4">

                <h2>Create Lead</h2>

                <form
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form-control mb-3"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="form-control mb-3"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        className="form-control mb-3"
                        value={formData.source}
                        onChange={handleChange}
                    />

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        className="form-control mb-3"
                        value={formData.notes}
                        onChange={handleChange}
                    />

                    <button
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Lead"}
                    </button>

                </form>

            </div>

        </div>

    );
}

export default LeadForm;