import axios from "axios";
import { encryptData, decryptData } from "../utils/frontendCrypto";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor - handles authentication and encryption
axiosInstance.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      "/users/resetPassword",
      "/users/forgotPassword",
      "/users/verifyOTP",
    ];

    // Skip authentication and encryption for public routes
    if (publicRoutes.some((route) => config.url.includes(route))) {
      return config;
    }

    // Add authentication token for protected routes
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Encrypt data for protected routes (skip FormData)
    if (config.data && !(config.data instanceof FormData)) {
      config.data = { payload: encryptData(JSON.stringify(config.data)) };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles decryption
axiosInstance.interceptors.response.use(
  (response) => {
    const publicRoutes = [
      "/users/resetPassword",
      "/users/forgotPassword",
      "/users/verifyOTP",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      response.config.url.includes(route)
    );

    // Skip decryption for public routes
    if (isPublicRoute) {
      return response;
    }

    // Decrypt response for protected routes
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
