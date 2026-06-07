import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL.replace(/\/$/, "")}/auth/refresh`,
                        { token: refreshToken }
                    );

                    localStorage.setItem("token", response.data.token);
                    originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default API;
