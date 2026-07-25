"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center h-9 w-16 rounded-full border border-border bg-surface2 px-1 transition-colors"
    >
      <span
        className="absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-bg shadow-glow transition-transform duration-300"
        style={{ transform: isDark ? "translateX(0px)" : "translateX(28px)" }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}
