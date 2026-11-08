import {
  ApiError,
  type ApiResponse,
  ApiStatus,
  type AuthTokens,
} from "../types/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

    const payload: ApiResponse<
      { access_token: string; refresh_token: string }
    > = await response.json();

    if (payload.code === ApiStatus.OK || payload.code === ApiStatus.CREATED) {
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
  isRetry = false,
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
    console.log("API response body:", body);
  } catch {
    console.warn(
      "Failed to parse JSON response from API:",
      response.status,
      response.statusText,
    );
  }

  // Intercept ApiStatus.AUTH_TOKEN_EXPIRED (2004 / HTTP 401)
  if (
    !isRetry &&
    (body?.code === ApiStatus.AUTH_TOKEN_EXPIRED || response.status === 401) &&
    !endpoint.includes("/api/v1/auth/login") &&
    !endpoint.toLowerCase().includes("/api/v1/auth/refresh")
  ) {
    if (!refreshPromise) {
      refreshPromise = rotateTokens().finally(() => {
        refreshPromise = null;
      });
    }

    const rotated = await refreshPromise;
    if (rotated) {
      return apiClient<T>(endpoint, options, true);
    } else {
      tokenStorage.clearTokens();
      onUnauthorizedCallback?.();
      throw new ApiError(
        "Session expired. Please log in again.",
        ApiStatus.AUTH_TOKEN_EXPIRED,
        401,
      );
    }
  }

  // Unwrap successful response (OK = 1000, CREATED = 1001)
  if (
    response.ok &&
    body &&
    (body.code === ApiStatus.OK || body.code === ApiStatus.CREATED)
  ) {
    return body.data;
  }

  if (
    body?.code === ApiStatus.VALIDATION_FAILED &&
    body.data &&
    typeof body.data === "object"
  ) {
    const fieldErrors = body.data as unknown as Record<string, string[]>;
    const firstError = Object.values(fieldErrors)[0]?.[0];
    throw new ApiError(
      firstError || "Please check your input and try again.",
      ApiStatus.VALIDATION_FAILED,
      response.status,
      fieldErrors,
    );
  }

  if (body?.code === ApiStatus.AUTH_USER_NOT_FOUND) {
    throw new ApiError(
      "Invalid email or password.",
      ApiStatus.AUTH_USER_NOT_FOUND,
      response.status,
    );
  }

  const nestedErrorMessage = body?.data &&
      typeof body.data === "object" &&
      "message" in body.data &&
      typeof (body.data as { message?: unknown }).message === "string"
    ? (body.data as { message: string }).message
    : undefined;

  throw new ApiError(
    nestedErrorMessage || body?.message || "An unexpected error occurred",
    body?.code || (response.status as ApiStatus),
    response.status,
  );
}
