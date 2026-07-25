import { MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
      <MailCheck className="mx-auto text-primary" size={40} />
      <h2 className="mt-4 font-display text-2xl font-bold">Check your inbox</h2>
      <p className="mt-2 text-sm text-muted">
        We've sent a verification link to your email. Click it to activate your account.
      </p>
      <Button href="/login" variant="outline" className="mt-6 w-full">Back to Sign in</Button>
    </div>
  );
}
