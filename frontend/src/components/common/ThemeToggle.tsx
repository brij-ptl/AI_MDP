"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-dot"
      id="themeToggle"
      aria-label="Toggle light theme"
      aria-pressed={!isDark}
      onClick={toggleTheme}
    >
      ◐
    </button>
  );
}
