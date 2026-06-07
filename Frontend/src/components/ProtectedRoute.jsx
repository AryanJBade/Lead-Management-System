import { Navigate } from "react-router-dom";
import { getTokenPayload } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
    const token = localStorage.getItem("token");
    const payload = getTokenPayload();

    if (!token) {
        return <Navigate to="/" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(payload?.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default ProtectedRoute;
