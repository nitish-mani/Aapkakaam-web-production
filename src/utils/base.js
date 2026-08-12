/**
 * API base URL, read from a Vite env variable at build time.
 *
 * The value MUST include any prefix your backend mounts routes under
 * (this project mounts everything under `/api`, so a typical value is
 * `http://localhost:3000/api` or `https://api.aapkakaam.com/api`).
 *
 * Configure per environment via `.env.development`, `.env.production`, etc.
 */
const rawUrl = import.meta.env.VITE_API_URL;

if (!rawUrl && import.meta.env.PROD) {
  // Fail fast in production if the API URL wasn't provided at build time.
   
  console.error(
    "[config] VITE_API_URL is not defined. Every network request will fail.",
  );
}

// Strip trailing slash for consistent template-literal concatenation.
export const SERVER_URL = (rawUrl || "/api").replace(/\/+$/, "");
