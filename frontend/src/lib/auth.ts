import { AuthState } from "@/type/auth";

const AUTH_KEY = "lacha_auth";

export function getAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function setAuth(auth: AuthState) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthToken() {
  return getAuth()?.token ?? null;
}

export function isAuthTokenValid() {
  const auth = getAuth();
  if (!auth?.token) return false;
  if (!auth.tokenValidBefore) return true;
  const validBefore = Date.parse(auth.tokenValidBefore);
  if (Number.isNaN(validBefore)) return true;
  return Date.now() < validBefore;
}
