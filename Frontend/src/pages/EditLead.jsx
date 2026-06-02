import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function EditLead() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        status: "",
        notes: ""
    });

    useEffect(() => {

        fetchLead();

    }, []);

    const fetchLead = async () => {

        try {

            const response =
                await API.get(
                    `/leads/${id}`
                );

            const lead =
                response.data[0];

            setFormData({
                name: lead.name || "",
                email: lead.email || "",
                phone: lead.phone || "",
                source: lead.source || "",
                status: lead.status || "",
                notes: lead.notes || ""
            });

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.put(
                `/leads/${id}`,
                formData
            );

            alert(
                "Lead Updated Successfully"
            );

            navigate("/leads");

        } catch (error) {

            console.log(error);

            alert(
                "Update Failed"
            );

        }

    };

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <div className="card p-4">

                    <h2 className="mb-4">
                        Edit Lead
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            name="name"
                            className="form-control mb-3"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            className="form-control mb-3"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="phone"
                            className="form-control mb-3"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="source"
                            className="form-control mb-3"
                            placeholder="Source"
                            value={formData.source}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="status"
                            className="form-control mb-3"
                            placeholder="Status"
                            value={formData.status}
                            onChange={handleChange}
                        />

                        <textarea
                            name="notes"
                            className="form-control mb-3"
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />

                        <button
                            className="btn btn-warning"
                        >
                            Update Lead
                        </button>

                    </form>

                </div>

            </div>

        </>
    );
}

export default EditLead;