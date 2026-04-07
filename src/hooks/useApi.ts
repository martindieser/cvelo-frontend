import { useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/apiClient";
import { useAuth } from "./useAuth";

/**
 * Custom hook to wrap apiFetch.
 */
export function useApi() {
  const { clearSession } = useAuth();

  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiFetch(endpoint, options);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        console.warn("401 Unauthorized detected. Clearing session...");
        clearSession();
      }
      throw err;
    }
  }, [clearSession]);

  return { apiCall };
}
