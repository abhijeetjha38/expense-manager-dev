"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

/**
 * Hook for pages that require authentication (e.g. /home).
 * Validates the token by calling GET /api/auth/me.
 * Redirects to /login if unauthenticated.
 */
export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    apiFetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          clearTokens();
          router.replace("/login");
        }
      })
      .catch(() => {
        clearTokens();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return { user, loading };
}

/**
 * Hook for public pages (/, /login, /register).
 * If the user is already authenticated, redirect to /home.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setChecking(false);
      return;
    }

    apiFetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) {
          router.replace("/home");
        } else {
          clearTokens();
          setChecking(false);
        }
      })
      .catch(() => {
        clearTokens();
        setChecking(false);
      });
  }, [router]);

  return { checking };
}

/**
 * Logout helper — revokes the refresh token server-side,
 * clears local storage, and redirects to /.
 */
export async function logout() {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      // Best-effort; clear tokens regardless.
    }
  }

  clearTokens();
  window.location.href = "/";
}
