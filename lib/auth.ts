// Simple client-side access gate for HMA Billing Studio.
// This app has no backend/database, so this is a lightweight PIN-style gate to keep
// casual/unauthorized users out - NOT secure authentication. Anyone who inspects the
// site's source could recover these credentials. Change them any time by editing the
// values below and redeploying.
export const APP_CREDENTIALS = {
  username: "hmaadmin",
  password: "HMA@Billing2026",
};

const AUTH_KEY = "hma_billing_auth";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function login(username: string, password: string): boolean {
  const ok =
    username.trim().toLowerCase() === APP_CREDENTIALS.username.toLowerCase() &&
    password === APP_CREDENTIALS.password;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, "true");
  }
  return ok;
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}
