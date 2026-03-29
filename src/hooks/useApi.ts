import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { apiFetch, ApiError } from "@/lib/apiClient";

/**
 * Custom hook to wrap apiFetch with automatic logout on 401 Unauthorized.
 * This is the recommended way to handle authentication-aware API calls in React.
 */
export function useApi() {
  const { logout } = useAuth();

  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiFetch(endpoint, options);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        console.warn("401 Unauthorized detected. Logging out...");
        logout();
      }
      throw err;
    }
  }, [logout]);

  return { apiCall };
}
