import { AuthFooter, SignupForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create a secure AgentOS workspace"
      description="Provision an operator account, establish workspace identity, and bring your AI operations layer online with role-aware access from day one."
      asideTitle="Workspace creation built in"
      asideDescription="Sign-up captures owner identity, workspace naming, and onboarding metadata so the app can route you directly into setup."
      footer={<AuthFooter prompt="Already have access?" href="/login" cta="Sign in" />}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-white">
          Create account
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Set up your operator workspace and start orchestration.
        </p>
      </div>
      <SignupForm />
    </AuthShell>
  );
}

