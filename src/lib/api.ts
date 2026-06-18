import axios from "axios";

// Access the API token from localStorage
export const getAuthToken = () => localStorage.getItem("auth_token");
export const setAuthToken = (token: string) => localStorage.setItem("auth_token", token);
export const removeAuthToken = () => localStorage.removeItem("auth_token");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 Unauthorized and standard errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Handle Unauthorized
      if (status === 401) {
        removeAuthToken();
        // Dispatch event for UI to react (e.g. redirect to login)
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      // Format Validation Errors (422) for easier UI consumption
      if (status === 422 && error.response.data?.errors) {
        error.validationErrors = error.response.data.errors;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
