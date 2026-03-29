/**
 * Fetch wrapper that handles:
 * - Attaching Authorization: Bearer <access_token> header
 * - Silent token refresh on 401 responses
 * - Redirect to /login when refresh also fails
 */

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Flag to prevent multiple concurrent refresh attempts. */
let isRefreshing = false;

/**
 * Attempt to exchange the stored refresh token for a new access token.
 * Returns `true` on success, `false` on failure (tokens are cleared).
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    // Keep the existing refresh token; only the access token is rotated.
    setTokens(data.access_token, refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

/**
 * Core fetch wrapper.
 *
 * Usage:
 * ```ts
 * const res = await apiFetch("/api/auth/me");
 * const data = await res.json();
 * ```
 *
 * @param path - API path (e.g. "/api/auth/me"). Prepended with API_BASE_URL.
 * @param options - Standard RequestInit options (method, body, headers …).
 * @returns The raw Response object.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const url = `${API_BASE_URL}${path}`;

  let response = await fetch(url, { ...options, headers });

  // On 401, try a silent refresh once, then retry the original request.
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    const refreshed = await refreshAccessToken();
    isRefreshing = false;

    if (refreshed) {
      // Retry with the new access token.
      const newToken = getAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
      }
      response = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed — redirect to login.
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}
