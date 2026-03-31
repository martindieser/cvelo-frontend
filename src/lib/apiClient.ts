// src/lib/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw new ApiError(`API error ${res.status}`, res.status);
  }

  // Handle empty responses (like 204 No Content)
  if (res.status === 204) return null;
  
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  
  return res.text();
};
