export const getTokenPayload = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error("Invalid token payload", error);
        return null;
    }
};

export const getUserRole = () => {
    const payload = getTokenPayload();
    return payload?.role || null;
};

export const getUserInfo = () => {
    const payload = getTokenPayload();
    if (!payload) return null;
    return {
        id: payload.id,
        role: payload.role
    };
};

export const isManagerOrAdmin = () => {
    const role = getUserRole();
    return role === "manager" || role === "admin";
};
