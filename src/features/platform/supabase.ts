import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseBrowserClientOrNull() {
  const env = getSupabaseEnv("browser-runtime");

  if (!env.isConfigured) {
    return null;
  }

  browserClient ??= createSupabaseBrowserClient();
  return browserClient;
}
