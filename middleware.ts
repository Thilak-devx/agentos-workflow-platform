import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";
import { assertSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/config";

const protectedPrefixes = ["/dashboard", "/agents", "/workflows", "/treasury", "/settings", "/demo"];
const authPrefixes = ["/login", "/signup", "/forgot-password", "/reset-password"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseEnv = getSupabaseEnv("middleware");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    !supabaseEnv.isConfigured
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  const verifiedSupabaseEnv = assertSupabaseEnv("middleware");

  const supabase = createServerClient(
    verifiedSupabaseEnv.url,
    verifiedSupabaseEnv.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && matchesPrefix(pathname, protectedPrefixes)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirectTo",
      sanitizeRedirectPath(
        `${pathname}${request.nextUrl.search || ""}`,
        "/dashboard",
      ),
    );
    return NextResponse.redirect(loginUrl);
  }

  if (user && matchesPrefix(pathname, authPrefixes)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const onboardingCompleted = user?.user_metadata?.onboarding_completed === true;
  if (user && !onboardingCompleted && matchesPrefix(pathname, protectedPrefixes) && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (user && onboardingCompleted && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
