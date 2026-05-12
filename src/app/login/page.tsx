import { Suspense } from "react";
import { AuthFooter, LoginForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

function LoginFormFallback() {
  return (
    <div className="space-y-5">
      <div className="h-[78px] rounded-[22px] border border-white/8 bg-white/[0.03]" />
      <div className="h-[94px] rounded-[22px] border border-white/8 bg-white/[0.03]" />
      <div className="h-11 rounded-full border border-white/8 bg-white/[0.03]" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to your operator workspace"
      description="Access your autonomous workflows, treasury surfaces, agent telemetry, and command system through one protected operator session."
      asideTitle="Governed operator access"
      asideDescription="Sessions persist through Supabase Auth, route protection, and wallet-aware workspace controls."
      footer={<AuthFooter prompt="New to AgentOS?" href="/signup" cta="Create an account" />}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-white">
          Login
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Continue into your workspace command center.
        </p>
      </div>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
