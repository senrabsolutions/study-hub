"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        Theme
      </button>
    );
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {activeTheme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        System
      </button>
    </div>
  );
}