"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Bell, Star, User, Settings, LogOut } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

 
export default function DashboardTopbar({ title }: { title: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSubscribed(Cookies.get("vitalis_subscribed") === "true");
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-6 bg-surface">
      <h1 className="font-display text-xl font-bold text-text">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-muted hover:text-primary transition-colors duration-200" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <ThemeToggle />
        <div className="relative" ref={dropdownRef}>
          <button 
            type="button"
            className="relative outline-none" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-light border border-border transition-transform hover:scale-105" />
            {isSubscribed && (
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-warning border border-surface text-surface text-[9px] shadow-sm animate-pulse">
                ★
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface p-2 shadow-card animate-fadeIn z-50">
              {user && (
                <div className="px-3 py-2 border-b border-border mb-2">
                  <p className="text-sm font-semibold text-text truncate">{user.full_name}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
              )}
              <Link 
                href="/profile" 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <User size={16} className="text-muted" /> View Profile
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Settings size={16} className="text-muted" /> Settings
              </Link>
              <button 
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#C1554A] hover:bg-[#C1554A]/10 transition-colors mt-1"
                onClick={() => { setMenuOpen(false); logout(); }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
