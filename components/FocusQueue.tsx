"use client";

import Link from "next/link";
import type { FocusItem } from "@/hooks/useDashboardStats";

type FocusQueueProps = {
  items: FocusItem[];
};

function getFocusLabel(priority: 1 | 2 | 3): string {
  if (priority === 3) return "Review Quiz";
  if (priority === 2) return "Start Lesson";
  return "Finish Mastery";
}

function getFocusLabelClass(priority: 1 | 2 | 3): string {
  if (priority === 3)
    return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
  if (priority === 2)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
  return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
}

export function FocusQueue({ items }: FocusQueueProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-3xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm sm:p-6 lg:mt-10 dark:border-yellow-800 dark:bg-yellow-950 dark:shadow-none">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Focus Queue
      </h2>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
        Based on your progress, here&apos;s what to work on next.
      </p>

      <div className="mt-4 space-y-3">
        {items.map(({ lesson, priority }) => (
          <Link
            key={`${lesson.track}-${lesson.slug}`}
            href={`/tracks/${lesson.track}/${lesson.slug}`}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lesson.track}
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {lesson.title}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getFocusLabelClass(priority)}`}
            >
              {getFocusLabel(priority)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
