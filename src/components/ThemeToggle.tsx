"use client";

import { THEME_KEY } from "@/lib/theme";

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme just won't persist.
  }
}

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="라이트/다크 모드 전환"
      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <span className="dark:hidden" aria-hidden="true">
        🌙
      </span>
      <span className="hidden dark:inline" aria-hidden="true">
        ☀️
      </span>
    </button>
  );
}
