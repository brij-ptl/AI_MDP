"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

const ADMIN_LINKS = [
  ["Dashboard", "/admin/dashboard"], ["Users", "/admin/users"], ["Diseases", "/admin/diseases"],
  ["Models", "/admin/models"], ["Datasets", "/admin/datasets"], ["Payments", "/admin/payments"],
  ["Subscriptions", "/admin/subscriptions"], ["Feedback", "/admin/feedback"],
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
  const { user, loading } = useAuth();

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
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/60 lg:block">
        <div className="flex h-20 items-center border-b border-border px-6"><Logo /></div>
        <nav className="space-y-1 p-4">
          {ADMIN_LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface2 hover:text-text">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-20 items-center justify-between border-b border-border px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin Panel</p>
          <ThemeToggle />
        </header>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
