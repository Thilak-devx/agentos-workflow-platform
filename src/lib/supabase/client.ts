import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const env = assertSupabaseEnv("browser");

  return createBrowserClient(env.url, env.anonKey);
}
