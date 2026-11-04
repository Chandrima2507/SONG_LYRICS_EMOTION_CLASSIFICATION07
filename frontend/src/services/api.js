const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getAuthHeader() {
  const token = localStorage.getItem("emolyrics_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // NLP Emotion Analysis
  analyzeLyrics: (payload) =>
    request("/analyze-mood", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // Analyses History & CRUD
  getAnalyses: ({ mood, search, page = 1, limit = 12 } = {}) => {
    const params = new URLSearchParams();
    if (mood && mood !== "All") params.append("mood", mood);
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", limit);
    return request(`/analyses?${params.toString()}`);
  },

  saveAnalysis: (payload) =>
    request("/analyses", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  deleteAnalysis: (id) =>
    request(`/analyses/${id}`, {
      method: "DELETE"
    }),

  // Playlists
  getPlaylists: () => request("/playlists"),
  getPlaylistByMood: (mood) => request(`/playlists/${encodeURIComponent(mood)}`),

  // Stats & Team Benchmarks
  getStats: () => request("/stats"),

  // Authentication
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getMe: () => request("/auth/me")
};
