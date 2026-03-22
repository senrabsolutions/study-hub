"use client";

import Link from "next/link";

type Lesson = {
  track: string;
  slug: string;
  title: string;
};

type DashboardStatsProps = {
  trackCount: number;
  totalLessons: number;
  completedLessons: number;
  quizPassedLessons: number;
  masteredLessons: number;
  firstIncompleteLesson: Lesson | null;
  isLoaded: boolean;
};

export function DashboardStats({
  trackCount,
  totalLessons,
  completedLessons,
  quizPassedLessons,
  masteredLessons,
  firstIncompleteLesson,
  isLoaded,
}: DashboardStatsProps) {
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tracks</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {trackCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lessons Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
            {isLoaded ? `${completedLessons} / ${totalLessons}` : "Loading"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quizzes Passed
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
            {isLoaded ? `${quizPassedLessons} / ${totalLessons}` : "Loading"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Mastered</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
            {isLoaded ? `${masteredLessons} / ${totalLessons}` : "Loading"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Next Up</p>
          <p className="mt-2 text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">
            {isLoaded
              ? (firstIncompleteLesson?.title ?? "All available lessons completed")
              : "Loading"}
          </p>
        </div>
      </div>

      {isLoaded && firstIncompleteLesson && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/tracks/${firstIncompleteLesson.track}/${firstIncompleteLesson.slug}`}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Resume Studying →
          </Link>
          <Link
            href="/rapid"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Open Rapid Practice →
          </Link>
          <Link
            href="/automation"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Open Automation Drills →
          </Link>
        </div>
      )}
    </>
  );
}
