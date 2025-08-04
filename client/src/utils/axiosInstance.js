import axios from "axios";
import { encryptData, decryptData } from "../utils/frontendCrypto";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", 
});

// Add token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Encrypt data if present
    if (config.data) {
      config.data = { payload: encryptData(JSON.stringify(config.data)) };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Decrypt response if payload exists
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.payload) {
      const decrypted = decryptData(response.data.payload);
      try {
        response.data = JSON.parse(decrypted);
      } catch {
        response.data = decrypted;
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
