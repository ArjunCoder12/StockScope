import axios from "axios";

//Need to either add api url if a secret to an .env file, or just put it here.
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
