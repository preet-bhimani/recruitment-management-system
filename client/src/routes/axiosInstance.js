import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7119/api/",
});

// Add Token With Request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error Handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    // If Token is Expired
    if (status === 401) {
      toast.error("Session Expired Login Again");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      window.location.href = "/login";
    }

    // Role is Different
    if (status === 403) {
      toast.error("You Have No Access of It");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
