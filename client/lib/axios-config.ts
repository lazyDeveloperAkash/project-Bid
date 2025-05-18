import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4006/api/v1",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true, // Important for cookies/auth
});

// Add a request interceptor to include auth token from localStorage if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Check if we're in a browser environment
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token")
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// Add a response interceptor to handle common errors
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     // Handle 401 Unauthorized errors (token expired, etc.)
//     if (error.response && error.response.status === 401) {
//       // Check if we're in a browser environment
//       if (typeof window !== "undefined") {
//         // Clear local storage
//         localStorage.removeItem("token")

//         // Redirect to login page if not already there
//         if (!window.location.pathname.includes("/auth/signin")) {
//           window.location.href = "/auth/signin"
//         }
//       }
//     }

//     return Promise.reject(error)
//   },
// )

export default axiosInstance;
