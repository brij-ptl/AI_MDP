"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Bell, Star } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
 
export default function DashboardTopbar({ title }: { title: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSubscribed(Cookies.get("vitalis_subscribed") === "true");
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-6 bg-surface/10">
      <h1 className="font-display text-xl font-bold text-text">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-muted hover:text-primary transition-colors duration-200" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <ThemeToggle />
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary border border-border" />
          {isSubscribed && (
            <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FBBF24] border border-bg text-bg text-[9px] shadow-sm animate-pulse">
              ★
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
