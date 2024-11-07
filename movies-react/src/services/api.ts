import axios from "axios";
import AuthService from "./authService";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*
    Response Interceptor
*/
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Logout e define o sinalizador para redirecionamento
            AuthService.logout();
        }
        return Promise.reject(error);
    }
);

export { api };
