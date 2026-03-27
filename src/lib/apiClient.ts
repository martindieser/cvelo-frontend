// src/lib/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include", // por si después usás cookies
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
};