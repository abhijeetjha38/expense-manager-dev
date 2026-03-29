/**
 * Token management utilities for localStorage-based auth.
 *
 * Stores access and refresh tokens under well-known keys.
 * All functions are client-side only (require `window`).
 */

const ACCESS_TOKEN_KEY = "expense_manager_access_token";
const REFRESH_TOKEN_KEY = "expense_manager_refresh_token";

/** Retrieve the stored access token, or null if absent. */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** Retrieve the stored refresh token, or null if absent. */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** Persist both tokens after login / registration. */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/** Remove both tokens on logout or auth failure. */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** Quick check whether we have an access token stored (not validated). */
export function hasTokens(): boolean {
  return getAccessToken() !== null;
}
