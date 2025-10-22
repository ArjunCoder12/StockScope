import axios from "axios";

// Use environment variable if available, otherwise default to localhost
// All routes use relative paths (e.g., /stock-list) which will be appended to this base
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds - backend can be slow with Alpha Vantage
  headers: {
    "Content-Type": "application/json",
  },
});
