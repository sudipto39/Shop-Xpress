import axios from "axios";
import toast from "react-hot-toast";

// 🔴 Base URL (FAIL FAST if not defined)
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined. Check your environment variables.");
}

// Axios instance
const instance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// =======================
// REQUEST INTERCEPTOR
// =======================
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / server unreachable
    if (!error.response) {
      toast.error("Network error. Please check your internet connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        toast.error(data?.message || "Bad request");
        break;

      case 401:
        toast.error(data?.message || "Session expired. Please login again.");
        localStorage.removeItem("token");
        if (!["/login", "/register"].includes(window.location.pathname)) {
          window.location.href = "/login";
        }
        break;

      case 403:
        toast.error(data?.message || "You are not allowed to perform this action.");
        break;

      case 404:
        toast.error(data?.message || "Requested resource not found.");
        break;

      case 409:
        toast.error(data?.message || "Conflict occurred.");
        break;

      case 422:
        if (data?.errors) {
          Object.values(data.errors).forEach((err) => toast.error(err));
        } else {
          toast.error("Validation error.");
        }
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default instance;