"use client";
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold">Reset your password</h2>
      <p className="mt-2 text-sm text-muted">Enter your account email and we'll send a reset link.</p>
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="auth-input">
          <input type="email" required />
          <label>Email address</label>
          <Mail size={18} className="field-icon" />
        </div>
        <Button className="w-full">Send Reset Link</Button>
      </form>
    </div>
  );
}
