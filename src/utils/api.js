/**
 * Central axios instance.
 *
 * - Uses `SERVER_URL` as the base URL so every call is 1 line shorter and
 *   never accidentally hits localhost from a production build.
 * - Injects the bearer token from localStorage for the current audience
 *   (`localStorage.getItem("category")` — one of "user" | "vendor" |
 *   "admin" | "employee").
 * - On 401, clears the stored session for that audience and dispatches a
 *   `auth:unauthorised` window event so any listener (e.g. router) can
 *   redirect to `/login`.
 *
 * Legacy code that still constructs URLs from `${SERVER_URL}/...` and passes
 * its own `Authorization` header continues to work — this instance is opt-in.
 */
import axios from "axios";
import { SERVER_URL } from "./base";

const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  try {
    const category = localStorage.getItem("category");
    if (category) {
      const session = JSON.parse(localStorage.getItem(category) || "null");
      if (session?.token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    }
  } catch {
    // Ignore JSON parse errors — treat as unauthenticated.
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const category = localStorage.getItem("category");
      if (category) {
        try {
          localStorage.removeItem(category);
        } catch {
          /* ignore */
        }
      }
      window.dispatchEvent(new CustomEvent("auth:unauthorised"));
    }
    return Promise.reject(error);
  },
);

export default api;
