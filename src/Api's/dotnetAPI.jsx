import axios from "axios";
import { toast } from "react-hot-toast";

const dotnetAPI = axios.create({
  baseURL: "https://localhost:7006/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT
dotnetAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired token
dotnetAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default dotnetAPI;
