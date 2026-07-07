const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "productscribe-token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  // 204 No Content — nothing to parse
  if (res.status === 204) return null;

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export const api = {
  // ─── Auth ───────────────────────────────────────────────────────────────
  /** POST /api/auth/signup */
  signup: (businessName, email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ businessName, email, password }),
    }),

  /** POST /api/auth/login */
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  /** GET /api/auth/me */
  me: () => request("/auth/me"),

  // ─── Descriptions ───────────────────────────────────────────────────────
  /** GET /api/descriptions */
  listDescriptions: (tone) =>
    request(`/descriptions${tone ? `?tone=${tone}` : ""}`),

  /** GET /api/descriptions/search?q=... */
  searchDescriptions: (q) =>
    request(`/descriptions/search?q=${encodeURIComponent(q)}`),

  /** GET /api/descriptions/:id */
  getDescription: (id) => request(`/descriptions/${id}`),

  /** POST /api/descriptions */
  createDescription: (body) =>
    request("/descriptions", { method: "POST", body: JSON.stringify(body) }),

  /** POST /api/descriptions/generate (preview, no save) */
  generatePreview: (rawNotes, tone) =>
    request("/descriptions/generate", {
      method: "POST",
      body: JSON.stringify({ rawNotes, tone }),
    }),

  /** PUT /api/descriptions/:id */
  updateDescription: (id, body) =>
    request(`/descriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  /** DELETE /api/descriptions/:id */
  deleteDescription: (id) =>
    request(`/descriptions/${id}`, { method: "DELETE" }),
};