"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative p-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--primary)] transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-sm"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[var(--primary)] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--primary)] transition-transform duration-200 rotate-0 scale-100" />
      )}
    </button>
  );
}
