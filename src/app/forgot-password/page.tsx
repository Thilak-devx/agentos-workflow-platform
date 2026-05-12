import { AuthFooter, ForgotPasswordForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recover your operator session"
      description="Reset workspace access securely without exposing treasury or orchestration surfaces to broken sessions."
      asideTitle="Secure recovery flow"
      asideDescription="Password resets stay inside Supabase Auth and return operators to a protected session."
      footer={<AuthFooter prompt="Remembered your password?" href="/login" cta="Back to login" />}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-white">
          Forgot password
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Enter your work email to receive a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </AuthShell>
  );
}

