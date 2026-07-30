"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Sparkles, KeyRound } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

// Custom Google SVG Logo
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

// Custom GitHub SVG Logo
const GithubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// Custom Apple SVG Logo
const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .98.07 2.14-.54 2.8-1.44z" />
  </svg>
);

export default function AuthCard({ initialMode }: { initialMode: "login" | "register" }) {
  const [active, setActive] = useState(initialMode === "register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpText, setOtpText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const router = useRouter();
  const { refreshUser } = useAuth();

  const goRegister = () => {
    setActive(true);
    setValidationError(null);
    window.history.pushState({}, "", "/register");
  };
  const goLogin = () => {
    setActive(false);
    setValidationError(null);
    window.history.pushState({}, "", "/login");
  };

  const validateForm = (email: string, pass: string): boolean => {
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    if (pass.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    mode: "login" | "register"
  ) => {
    e.preventDefault();
    setValidationError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("name") as string;

    if (!otpMode && !validateForm(email, password)) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const response: any = await authService.login(email, password);
        const user = response.user;
        await refreshUser();

        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        await authService.register({
          full_name: fullName,
          email,
          password,
        });

        router.push("/login");
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${active ? "active" : ""}`}>
      <div className="curved-shape" />
      <div className="curved-shape2" />

      {/* LOGIN CARD */}
      <div className="form-box login-box">
        <h2 className="form-title anim">Welcome to Nidaan+</h2>
        <p className="form-sub anim">Enter your clinical authorization credentials</p>

        {validationError && !active && (
          <div className="auth-error anim">{validationError}</div>
        )}

        <form onSubmit={(e) => handleSubmit(e, "login")} className={otpMode ? "otp-active" : ""}>
          <div className="auth-input anim pw-field">
            <input type="email" name="email" required placeholder=" " />
            <label>Email Address</label>
            <Mail size={16} className="field-icon" />
          </div>

          <div className="auth-input anim pw-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=" "
            />
            <label>Password</label>
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="auth-input anim otp-field">
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={otpText}
              onChange={(e) => setOtpText(e.target.value.replace(/\D/g, ""))}
              placeholder=" "
              required={otpMode}
            />
            <label>6-Digit OTP</label>
          </div>

          <div className="row-between anim">
            <button
              type="button"
              className="link-action"
              onClick={() => setOtpMode(!otpMode)}
            >
              {otpMode ? "Use password instead" : "Login via OTP"}
            </button>
            <a href="/forgot-password" className="link-muted">Forgot password?</a>
          </div>

          <button type="submit" className="auth-btn anim" disabled={loading}>
            {loading ? "Processing..." : (otpMode ? "Verify & Sign In" : "Sign In")}
          </button>

          <div className="divider anim"><span>Or continue with</span></div>
          <div className="social-row anim">
            <button type="button" className="social-btn"><GoogleIcon /></button>
            <button type="button" className="social-btn"><GithubIcon /></button>
            <button type="button" className="social-btn"><AppleIcon /></button>
          </div>

          <p className="switch-line anim">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={goRegister}>Register</button>
          </p>
        </form>
      </div>

      <div className="info-content-side login-side">
        <h2><Sparkles size={20} className="spark" /> Nidaan+</h2>
        <p>Unlock clinical insights, risk modeling reports, and custom medical parameter trends. Powered by certified clinical datasets.</p>
      </div>

      {/* REGISTER CARD */}
      <div className="form-box register-box">
        <h2 className="form-title anim">Create Health Account</h2>
        <p className="form-sub anim">Register to evaluate medical reports in seconds</p>

        {validationError && active && (
          <div className="auth-error anim">{validationError}</div>
        )}

        <form onSubmit={(e) => handleSubmit(e, "register")}>
          <div className="auth-input anim">
            <input type="text" name="name" required placeholder=" " />
            <label>Full Name</label>
            <User size={16} className="field-icon" />
          </div>

          <div className="auth-input anim">
            <input type="email" name="email" required placeholder=" " />
            <label>Email Address</label>
            <Mail size={16} className="field-icon" />
          </div>

          <div className="auth-input anim">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=" "
            />
            <label>Password</label>
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="auth-btn anim" disabled={loading}>
            {loading ? "Processing..." : "Create Account"}
          </button>

          <div className="divider anim"><span>Or register with</span></div>
          <div className="social-row anim">
            <button type="button" className="social-btn"><GoogleIcon /></button>
            <button type="button" className="social-btn"><GithubIcon /></button>
            <button type="button" className="social-btn"><AppleIcon /></button>
          </div>

          <p className="switch-line anim">
            Already have an account?{" "}
            <button type="button" onClick={goLogin}>Sign In</button>
          </p>
        </form>
      </div>

      <div className="info-content-side register-side">
        <h2><Sparkles size={20} className="spark" /> Nidaan+</h2>
        <p>Create an account and get 2 free clinical prediction credits. No credit card required.</p>
      </div>
    </div>
  );
}
