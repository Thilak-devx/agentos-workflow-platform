const warnedContexts = new Set<string>();

type SupabaseEnvState = {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
  issues: string[];
};

type ConfiguredSupabaseEnvState = {
  url: string;
  anonKey: string;
  isConfigured: true;
  issues: string[];
};

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isPlaceholderValue(value: string | null) {
  if (!value) return true;

  return [
    "PASTE_",
    "YOUR_",
    "[YOUR-",
    "replace_with_",
    "example",
  ].some((token) => value.includes(token));
}

function normalizeSupabaseUrl(value: string | null) {
  if (!value) return null;

  return value
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/g, "");
}

function isValidSupabaseUrl(value: string | null) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url.origin);
  } catch {
    return false;
  }
}

function isLikelySupabaseAnonKey(value: string | null) {
  if (!value) return false;

  if (value.startsWith("eyJ")) {
    return value.length >= 32;
  }

  if (value.startsWith("sb_publishable_")) {
    return /^sb_publishable_[A-Za-z0-9._-]+$/.test(value);
  }

  return false;
}

function collectSupabaseEnv() {
  const rawUrl = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const rawAnonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const normalizedUrl = normalizeSupabaseUrl(rawUrl);
  const issues: string[] = [];

  if (!rawUrl) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
  } else if (isPlaceholderValue(rawUrl)) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL is still using a placeholder value.");
  } else if (/\/rest\/v1\/?$/i.test(rawUrl)) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_URL was set to a REST endpoint and has been normalized to the project base URL.",
    );
  } else if (!isValidSupabaseUrl(normalizedUrl)) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_URL is not a valid Supabase project base URL.",
    );
  }

  if (!rawAnonKey) {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  } else if (isPlaceholderValue(rawAnonKey)) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is still using a placeholder value.",
    );
  } else if (!isLikelySupabaseAnonKey(rawAnonKey)) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid legacy anon JWT key or a modern sb_publishable key.",
    );
  }

  return {
    url: normalizedUrl,
    anonKey: rawAnonKey,
    isConfigured:
      Boolean(normalizedUrl) &&
      Boolean(rawAnonKey) &&
      isValidSupabaseUrl(normalizedUrl) &&
      isLikelySupabaseAnonKey(rawAnonKey) &&
      !isPlaceholderValue(normalizedUrl) &&
      !isPlaceholderValue(rawAnonKey),
    issues,
  } satisfies SupabaseEnvState;
}

function warnOnce(context: string, issues: string[]) {
  if (!issues.length || warnedContexts.has(context)) {
    return;
  }

  warnedContexts.add(context);
  console.warn(`[AgentOS][Supabase] ${issues.join(" ")}`);
}

export function getSupabaseEnv(context = "shared") {
  const state = collectSupabaseEnv();
  warnOnce(context, state.issues);
  return state;
}

export function isSupabaseConfigured() {
  return collectSupabaseEnv().isConfigured;
}

export function assertSupabaseEnv(context = "shared"): ConfiguredSupabaseEnvState {
  const state = getSupabaseEnv(context);

  if (!state.isConfigured || !state.url || !state.anonKey) {
    throw new Error(
      `[AgentOS][Supabase] ${state.issues.join(" ") || "Supabase environment is not configured."}`,
    );
  }

  return {
    ...state,
    url: state.url,
    anonKey: state.anonKey,
    isConfigured: true,
  };
}
