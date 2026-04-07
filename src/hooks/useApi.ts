import { useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/apiClient";

/**
 * Custom hook to wrap apiFetch.
 */
export function useApi() {
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiFetch(endpoint, options);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        console.warn("401 Unauthorized detected. Session may be invalid.");
      }
      throw err;
    }
  }, []);

  return { apiCall };
}

