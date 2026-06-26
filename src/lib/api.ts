import axios from "axios";

// Access the API token from localStorage
export const getAuthToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("auth_token");
  return null;
};
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem("auth_token", token);
};
export const removeAuthToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("auth_token");
};

const isServer = typeof window === "undefined";
const defaultBaseUrl = isServer ? "http://127.0.0.1:8000/api/v1" : "/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
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
