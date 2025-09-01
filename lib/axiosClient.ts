// /lib/axiosClient.ts
import axios from "axios";
import { getAuth } from "firebase/auth"; // Firebase Auth SDK

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Request interceptor: attach Firebase ID token
axiosClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(); // fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to get Firebase token:", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (optional)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
