"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/rapid", label: "Rapid Practice" },
  { href: "/automation", label: "Automation Drills" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  const getNavClassName = (href: string) => {
    const isActive =
      href === "/" ? pathname === "/" : pathname?.startsWith(href);

    return [
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      "whitespace-nowrap",
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
    ].join(" ");
  };

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link href="/" className="block min-w-0">
              <div className="text-base font-bold text-gray-900 sm:text-lg dark:text-gray-100">
                Study Hub
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                Windows CLI Engineering Study Platform
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:justify-end">
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getNavClassName(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex justify-start sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}