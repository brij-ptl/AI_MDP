"use client";
import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold">Set a new password</h2>
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="auth-input">
          <input type="password" required />
          <label>New password</label>
          <Lock size={18} className="field-icon" />
        </div>
        <div className="auth-input">
          <input type="password" required />
          <label>Confirm password</label>
          <Lock size={18} className="field-icon" />
        </div>
        <Button className="w-full">Update Password</Button>
      </form>
    </div>
  );
}
