import { type ApiResponse, ApiStatus, ApiError, type AuthTokens } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const ACCESS_TOKEN_KEY = "lc_access_token";
const REFRESH_TOKEN_KEY = "lc_refresh_token";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Event hook to notify AuthContext when refresh fails and forced logout is required
type UnauthorizedListener = () => void;
let onUnauthorizedCallback: UnauthorizedListener | null = null;

export const registerUnauthorizedListener = (cb: UnauthorizedListener) => {
  onUnauthorizedCallback = cb;
};

// Singleton promise to deduplicate concurrent token refresh calls
let refreshPromise: Promise<AuthTokens | null> | null = null;

async function rotateTokens(): Promise<AuthTokens | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      return null;
    }

    const payload: ApiResponse<{ access_token: string; refresh_token: string }> =
      await response.json();

    if (payload.status === ApiStatus.OK || payload.status === ApiStatus.CREATED) {
      const newTokens: AuthTokens = {
        accessToken: payload.data.access_token,
        refreshToken: payload.data.refresh_token,
      };
      tokenStorage.setTokens(newTokens);
      return newTokens;
    }

    tokenStorage.clearTokens();
    return null;
  } catch {
    tokenStorage.clearTokens();
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const accessToken = tokenStorage.getAccessToken();

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response fallback
  }

  // Intercept ApiStatus.AUTH_TOKEN_EXPIRED (2004 / HTTP 401)
  if (
    !isRetry &&
    (body?.status === ApiStatus.AUTH_TOKEN_EXPIRED || response.status === 401) &&
    !endpoint.includes("/api/v1/auth/login") &&
    !endpoint.includes("/api/v1/auth/Refresh")
  ) {
    if (!refreshPromise) {
      refreshPromise = rotateTokens().finally(() => {
        refreshPromise = null;
      });
    }

    const rotated = await refreshPromise;
    if (rotated) {
      // Retry the original request transparently with the new access token
      return apiClient<T>(endpoint, options, true);
    } else {
      // Refresh failed: clear session and notify router guard to redirect to /login
      tokenStorage.clearTokens();
      onUnauthorizedCallback?.();
      throw new ApiError(
        "Session expired. Please log in again.",
        ApiStatus.AUTH_TOKEN_EXPIRED,
        401
      );
    }
  }

  // Unwrap successful response (OK = 1000, CREATED = 1001)
  if (
    response.ok &&
    body &&
    (body.status === ApiStatus.OK || body.status === ApiStatus.CREATED)
  ) {
    return body.data;
  }

  // Map VALIDATION_FAILED (3001 / HTTP 400) field arrays
  if (body?.status === ApiStatus.VALIDATION_FAILED) {
    throw new ApiError(
      body.message || "Validation failed",
      ApiStatus.VALIDATION_FAILED,
      response.status,
      body.data as unknown as Record<string, string[]>
    );
  }

  throw new ApiError(
    body?.message || "An unexpected error occurred",
    body?.status || (response.status as ApiStatus),
    response.status
  );
}