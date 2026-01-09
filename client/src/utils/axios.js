import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: BASE_URL
    ? `${BASE_URL}/api/v1`
    : "https://shop-xpress.onrender.com/api/v1", // safe fallback
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      toast.error(data?.message || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default instance;
