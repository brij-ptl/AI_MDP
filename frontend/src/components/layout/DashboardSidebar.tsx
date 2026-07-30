"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Stethoscope, MessageSquareText, UploadCloud, FileText,
  History, BarChart3, User, Settings, Bell, CreditCard, Sparkles,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/prediction", label: "Disease Prediction", icon: Stethoscope },
  { href: "/symptom-checker", label: "AI Symptom Checker", icon: MessageSquareText },
  { href: "/upload-report", label: "Upload Report", icon: UploadCloud },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/history", label: "History", icon: History },
  { href: "/analytics", label: "Health Analytics", icon: BarChart3 },
  { href: "/subscription", label: "Subscription", icon: Sparkles },
  { href: "/payment", label: "Payment", icon: CreditCard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-border px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent",
                active 
                  ? "bg-surface2 text-primary border-l-primary/40 shadow-sm" 
                  : "text-muted hover:bg-surface2 hover:text-text hover:border-border"
              )}
            >
              <Icon size={18} className={active ? "text-primary" : "text-muted group-hover:text-primary transition-colors"} /> 
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
