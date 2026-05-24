// A small axios-like wrapper using Fetch to avoid an actual axios dependency.
// This keeps the API calling pattern consistent while staying compatible with Vite.

const BASE_URL = import.meta.env.VITE_API_URL ?? "";
const getToken = () => localStorage.getItem("token");
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const buildUrl = (path) => {
  if (path.startsWith("http")) return path;
  const base = BASE_URL.replace(/\/$/, ""); // remove trailing slash from base
  const p = path.replace(/^\//, ""); // remove leading slash from path
  return `${base}/${p}`;
};

const parseJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
};

const handleResponse = async (res) => {
  const payload = await parseJson(res);
  if (!res.ok) {
    // Automatically clear token on 401/403
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const message =
      payload?.errors?.[0]?.msg ||
      payload?.message ||
      payload ||
      res.statusText;
    throw new Error(message || "Request failed");
  }
  return payload;
};

const request = async (method, path, data, config = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(config.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = {
    method,
    headers,
    ...config,
  };

  if (data != null) {
    init.body = JSON.stringify(data);
  }

  const res = await fetch(buildUrl(path), init);
  return handleResponse(res);
};

export const api = {
  get: (path, config) => request("GET", path, null, config),
  post: (path, data, config) => request("POST", path, data, config),
  put: (path, data, config) => request("PUT", path, data, config),
  delete: (path, config) => request("DELETE", path, null, config),
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => !!getToken();

export const getCurrentUser = () => getUser();

export function registerUser({ fullName, email, password }) {
  return api.post("/api/users/register", { fullName, email, password });
}

export async function loginUser({ email, password }) {
  const payload = await api.post("/api/users/login", { email, password });
  if (payload?.token) {
    setToken(payload.token);
  }
  if (payload?.user) {
    setUser(payload.user);
  }
  return payload;
}

export function getTasks() {
  return api.get("/api/tasks");
}

export function createTask({ task_name, task_desc }) {
  return api.post("/api/tasks", { task_name, task_desc });
}

export function updateTask(id, data) {
  return api.put(`/api/tasks/${id}`, data);
}

export function deleteTask(id) {
  return api.delete(`/api/tasks/${id}`);
}
