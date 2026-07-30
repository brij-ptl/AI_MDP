"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import { LogOut } from "lucide-react";

const ADMIN_LINKS = [
  ["Dashboard", "/admin/dashboard"], ["Users", "/admin/users"], ["Diseases", "/admin/diseases"],
  ["Models", "/admin/models"], ["Payments", "/admin/payments"],
  ["Prediction Tokens", "/admin/prediction-tokens"], ["Reports", "/admin/reports"],
  ["Symptom Predictions", "/admin/symptom-predictions"], ["Feedback", "/admin/feedback"],
  ["Analytics", "/admin/analytics"], ["Logs", "/admin/logs"],
];

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted">Checking authentication...</p>
    </div>
  </div>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="flex h-20 items-center border-b border-border px-6"><Logo /></div>
        <nav className="space-y-1 p-4">
          {ADMIN_LINKS.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link 
                key={href} 
                href={href} 
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent ${
                  active 
                    ? "bg-surface2 text-primary border-l-primary/40 shadow-sm" 
                    : "text-muted hover:bg-surface2 hover:text-text hover:border-border"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin Panel</p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              type="button" 
              onClick={handleLogout} 
              className="flex items-center gap-2 rounded-xl border border-[#C1554A]/30 px-3 py-2 text-xs font-semibold text-[#C1554A] hover:bg-[#C1554A]/10 transition-colors"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </header>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
