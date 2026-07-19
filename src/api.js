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

  if (res.status === 204) return null;

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export const api = {
  signup: (businessName, email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ businessName, email, password }),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request("/auth/me"),

  deleteAccount: (password) =>
    request("/auth/me", {
      method: "DELETE",
      body: JSON.stringify(password ? { password } : {}),
    }),

  generateWithGemini: ({ productName, category, price, tone, rawNotes }) =>
    request("/ai/generate-description", {
      method: "POST",
      body: JSON.stringify({ productName, category, price, tone, rawNotes }),
    }),

  listDescriptions: (tone) =>
    request(`/descriptions${tone ? `?tone=${tone}` : ""}`),

  searchDescriptions: (q) =>
    request(`/descriptions/search?q=${encodeURIComponent(q)}`),

  getDescription: (id) => request(`/descriptions/${id}`),

  createDescription: (body) =>
    request("/descriptions", { method: "POST", body: JSON.stringify(body) }),

  generatePreview: (rawNotes, tone) =>
    request("/descriptions/generate", {
      method: "POST",
      body: JSON.stringify({ rawNotes, tone }),
    }),

  updateDescription: (id, body) =>
    request(`/descriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteDescription: (id) =>
    request(`/descriptions/${id}`, { method: "DELETE" }),
};
