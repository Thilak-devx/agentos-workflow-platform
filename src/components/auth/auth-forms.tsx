"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LucideIcon,
  Mail,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import { buildAuthCallbackUrl, sanitizeRedirectPath } from "@/lib/auth/redirect";
import { useRuntimeStore } from "@/store/runtime-store";
import { Button } from "@/components/ui/button";

function AuthNotice({
  tone = "default",
  children,
}: {
  tone?: "default" | "error" | "success";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-rose-300/12 bg-rose-400/[0.05] text-rose-50"
      : tone === "success"
        ? "border-emerald-300/12 bg-emerald-400/[0.05] text-emerald-50"
        : "border-white/8 bg-white/[0.03] text-white/58";

  return (
    <div className={`rounded-[20px] border px-4 py-3 text-sm leading-6 ${toneClass}`}>
      {children}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.872h5.382a4.606 4.606 0 0 1-1.995 3.02v2.507h3.228c1.89-1.74 2.985-4.304 2.985-7.354Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.618-2.419l-3.228-2.507c-.895.6-2.04.955-3.39.955-2.607 0-4.816-1.76-5.607-4.127H3.055v2.586A9.994 9.994 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.393 13.902A5.99 5.99 0 0 1 6.08 12c0-.66.113-1.3.313-1.902V7.512H3.055A9.994 9.994 0 0 0 2 12c0 1.614.386 3.143 1.055 4.488l3.338-2.586Z"
        fill="#FBBC04"
      />
      <path
        d="M12 5.97c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.96 2.982 14.695 2 12 2a9.994 9.994 0 0 0-8.945 5.512l3.338 2.586C7.184 7.73 9.393 5.97 12 5.97Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white/8" />
      <span className="text-[11px] tracking-[0.16em] text-white/34 uppercase">
        Or continue with
      </span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}

function AuthTextField({
  label,
  placeholder,
  type = "text",
  autoComplete,
  required = true,
  value,
  onChange,
  minLength,
  icon: Icon,
}: {
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">{label}</label>
      <div className="relative">
        {Icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/28">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-cyan-300/26 ${
            Icon ? "pl-11" : ""
          }`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  autoComplete,
  value,
  onChange,
  minLength,
}: {
  label?: string;
  placeholder: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-white">{label}</label>
      ) : null}
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/28 focus:border-cyan-300/26"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-3 flex items-center rounded-full px-2 text-white/38 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/28"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function GoogleAuthButton({
  mode,
  redirectTo,
  disabled,
  onError,
  onStart,
}: {
  mode: "login" | "signup";
  redirectTo?: string | null;
  disabled: boolean;
  onError: (message: string) => void;
  onStart: () => void;
}) {
  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClientOrNull();

    if (!supabase) {
      onError("Authentication is not available in this environment.");
      return;
    }

    onStart();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildAuthCallbackUrl(
          window.location.origin,
          redirectTo ?? "/dashboard",
        ),
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      onError(
        mode === "signup"
          ? "Google workspace creation is unavailable right now."
          : "Google sign-in is unavailable right now.",
      );
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full justify-center"
      disabled={disabled}
      onClick={() => void handleGoogleSignIn()}
    >
      <GoogleMark />
      {mode === "signup" ? "Continue with Google" : "Sign in with Google"}
    </Button>
  );
}

function AuthModeBanner({ type }: { type: "oauth" | "callback" | "signup" | null }) {
  if (type === "oauth") {
    return (
      <AuthNotice tone="default">
        Authentication is reconnecting. Please try your sign-in method again.
      </AuthNotice>
    );
  }

  if (type === "callback") {
    return (
      <AuthNotice tone="default">
        Sign-in confirmation expired. Restart the authentication flow to continue.
      </AuthNotice>
    );
  }

  if (type === "signup") {
    return (
      <AuthNotice tone="success">
        Workspace created. Confirm your email, then sign in to continue.
      </AuthNotice>
    );
  }

  return null;
}

export function LoginForm() {
  const supabase = getSupabaseBrowserClientOrNull();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const redirectTo = useMemo(
    () =>
      sanitizeRedirectPath(
        searchParams.get("redirectTo"),
        "/dashboard",
      ),
    [searchParams],
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Authentication is not available in this environment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (authError) {
      setError("Unable to sign in with those credentials.");
      return;
    }

    pushToast({
      title: "Welcome back",
      detail: "Operator session established successfully.",
      tone: "emerald",
    });
    router.push(redirectTo);
    router.refresh();
  }

  const queryState = useMemo(() => {
    const errorState = searchParams.get("error");
    if (errorState === "oauth" || errorState === "callback") {
      return errorState;
    }

    return searchParams.get("signup") === "success" ? "signup" : null;
  }, [searchParams]);
  const isBusy = isSubmitting || isGoogleSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <GoogleAuthButton
        mode="login"
        redirectTo={redirectTo}
        disabled={isBusy}
        onStart={() => {
          setError(null);
          setIsGoogleSubmitting(true);
        }}
        onError={(message) => {
          setIsGoogleSubmitting(false);
          setError(message);
        }}
      />

      <AuthDivider />

      <AuthModeBanner type={queryState} />

      <AuthTextField
        label="Email"
        placeholder="operator@workspace.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        icon={Mail}
      />

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-white">Password</label>
          <Link href="/forgot-password" className="text-sm text-cyan-100/80 transition hover:text-cyan-100">
            Forgot password
          </Link>
        </div>
        <PasswordField
          label=""
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
      </div>

      {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : isGoogleSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {isSubmitting
          ? "Signing in"
          : isGoogleSubmitting
            ? "Redirecting to Google"
            : "Login to AgentOS"}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const supabase = getSupabaseBrowserClientOrNull();
  const router = useRouter();
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const [fullName, setFullName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Authentication is not available in this environment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const workspaceSlug = workspaceName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildAuthCallbackUrl(window.location.origin, "/onboarding"),
        data: {
          full_name: fullName,
          workspace_name: workspaceName,
          workspace_id: `workspace-${workspaceSlug || "agentos"}`,
          avatar_label: fullName
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase(),
          role: "Owner",
          onboarding_completed: false,
        },
      },
    });

    setIsSubmitting(false);

    if (authError) {
      setError("We couldn't create that workspace account yet.");
      return;
    }

    pushToast({
      title: "Workspace created",
      detail: "Check your email to confirm access and continue onboarding.",
      tone: "emerald",
    });
    setSuccess("Account created. Confirm your email to continue into AgentOS.");
    router.push("/login?signup=success");
  }

  const isBusy = isSubmitting || isGoogleSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <GoogleAuthButton
        mode="signup"
        redirectTo="/onboarding"
        disabled={isBusy}
        onStart={() => {
          setError(null);
          setSuccess(null);
          setIsGoogleSubmitting(true);
        }}
        onError={(message) => {
          setIsGoogleSubmitting(false);
          setError(message);
        }}
      />

      <AuthDivider />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthTextField
          label="Full name"
          placeholder="Aarav Shah"
          value={fullName}
          onChange={setFullName}
        />
        <AuthTextField
          label="Workspace"
          placeholder="AgentOS Core"
          value={workspaceName}
          onChange={setWorkspaceName}
        />
      </div>

      <AuthTextField
        label="Work email"
        placeholder="operator@workspace.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        icon={Mail}
      />

      <PasswordField
        label="Password"
        placeholder="Use at least 8 characters"
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />

      {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
      {success ? <AuthNotice tone="success">{success}</AuthNotice> : null}

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : isGoogleSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {isSubmitting
          ? "Creating workspace"
          : isGoogleSubmitting
            ? "Redirecting to Google"
            : "Create workspace"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const supabase = getSupabaseBrowserClientOrNull();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError("Authentication is not available in this environment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (authError) {
      setError("We couldn't send a reset link right now.");
      return;
    }

    setStatus("Reset instructions sent. Check your inbox to continue.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthTextField
        label="Email"
        placeholder="operator@workspace.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        icon={Mail}
      />

      {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
      {status ? <AuthNotice tone="success">{status}</AuthNotice> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Sending reset link" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const supabase = getSupabaseBrowserClientOrNull();
  const router = useRouter();
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Authentication is not available in this environment.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: authError } = await supabase.auth.updateUser({
      password,
    });

    setIsSubmitting(false);

    if (authError) {
      setError("Unable to update the password right now.");
      return;
    }

    pushToast({
      title: "Password updated",
      detail: "Your operator credentials were updated successfully.",
      tone: "emerald",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PasswordField
        label="New password"
        placeholder="Use at least 8 characters"
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        label="Confirm password"
        placeholder="Repeat the new password"
        minLength={8}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Updating password" : "Update password"}
      </Button>
    </form>
  );
}

export function AuthFooter({
  prompt,
  href,
  cta,
}: {
  prompt: string;
  href: string;
  cta: string;
}) {
  return (
    <p className="text-sm text-white/46">
      {prompt}{" "}
      <Link href={href} className="text-cyan-100/80 transition hover:text-cyan-100">
        {cta}
      </Link>
    </p>
  );
}
