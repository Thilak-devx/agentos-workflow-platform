import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";

function buildWorkspaceMetadata(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const fullName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : user.email?.split("@")[0]?.replace(/[._-]+/g, " ")?.replace(/\b\w/g, (value) => value.toUpperCase()) ||
        "AgentOS Operator";

  const workspaceName =
    typeof user.user_metadata?.workspace_name === "string" &&
    user.user_metadata.workspace_name.trim().length > 0
      ? user.user_metadata.workspace_name.trim()
      : `${fullName.split(" ")[0] || "AgentOS"} Workspace`;

  const workspaceId =
    typeof user.user_metadata?.workspace_id === "string" &&
    user.user_metadata.workspace_id.trim().length > 0
      ? user.user_metadata.workspace_id.trim()
      : `workspace-${workspaceName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "agentos"}`;

  const avatarLabel =
    typeof user.user_metadata?.avatar_label === "string" &&
    user.user_metadata.avatar_label.trim().length > 0
      ? user.user_metadata.avatar_label.trim()
      : fullName
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

  return {
    full_name: fullName,
    workspace_name: workspaceName,
    workspace_id: workspaceId,
    avatar_label: avatarLabel,
    role:
      typeof user.user_metadata?.role === "string" &&
      user.user_metadata.role.trim().length > 0
        ? user.user_metadata.role
        : "Owner",
    onboarding_completed: user.user_metadata?.onboarding_completed === true,
  };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = sanitizeRedirectPath(
    requestUrl.searchParams.get("redirectTo"),
  );

  if (!code) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", "callback");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", "oauth");
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const metadata = buildWorkspaceMetadata(user);
  const hasMissingMetadata =
    metadata.full_name !== user.user_metadata?.full_name ||
    metadata.workspace_name !== user.user_metadata?.workspace_name ||
    metadata.workspace_id !== user.user_metadata?.workspace_id ||
    metadata.avatar_label !== user.user_metadata?.avatar_label ||
    metadata.role !== user.user_metadata?.role;

  if (hasMissingMetadata) {
    await supabase.auth.updateUser({
      data: metadata,
    });
  }

  const destination =
    user.user_metadata?.onboarding_completed === true
      ? redirectTo
      : "/onboarding";

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
