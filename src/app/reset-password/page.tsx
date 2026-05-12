import { AuthFooter, ResetPasswordForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new workspace password"
      description="Restore operator access with a fresh password and continue into the protected command center."
      asideTitle="Password update"
      asideDescription="This screen completes secure recovery after the Supabase reset link verifies the session."
      footer={<AuthFooter prompt="Need to return later?" href="/login" cta="Back to login" />}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-white">
          Reset password
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Choose a new password for your workspace account.
        </p>
      </div>
      <ResetPasswordForm />
    </AuthShell>
  );
}

