const DEFAULT_AUTH_REDIRECT = "/dashboard";

export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  if (!value) return fallback;

  const trimmed = value.trim();

  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return fallback;
  }

  return trimmed;
}

export function buildAuthCallbackUrl(origin: string, redirectTo?: string | null) {
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set(
    "redirectTo",
    sanitizeRedirectPath(redirectTo, DEFAULT_AUTH_REDIRECT),
  );
  return callbackUrl.toString();
}
