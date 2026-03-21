"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { makeLessonKey } from "@/lib/progress";

type Lesson = {
  track: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  duration?: string;
  difficulty?: string;
};

type TrackSidebarProps = {
  track: string;
  trackTitle: string;
  trackDescription: string;
  lessons: Lesson[];
  currentLessonSlug?: string;
};

export default function TrackSidebar({
  track,
  trackTitle,
  trackDescription,
  lessons,
  currentLessonSlug,
}: TrackSidebarProps) {
  const { progress } = useProgress();

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Track
      </p>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {trackTitle}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {trackDescription}
      </p>

      <div className="mt-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Lessons
          </h3>

          <Link
            href={`/tracks/${track}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            View Track
          </Link>
        </div>

        <nav className="space-y-2">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === currentLessonSlug;
            const key = makeLessonKey(lesson.track, lesson.slug);
            const isCompleted = progress[key]?.completed ?? false;
            const quizPassed = progress[key]?.quizPassed ?? false;
            const isMastered = isCompleted && quizPassed;

            return (
              <Link
                key={lesson.slug}
                href={`/tracks/${lesson.track}/${lesson.slug}`}
                className={[
                  "block rounded-xl border px-4 py-3 text-sm transition",
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 font-medium">
                    <span className="break-words">
                      Lesson {lesson.order}: {lesson.title}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      isCompleted
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {isCompleted ? "Complete" : "Todo"}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      quizPassed
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {quizPassed ? "Quiz Passed" : "Quiz Pending"}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      isMastered
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {isMastered ? "Mastered" : "Learning"}
                  </span>
                </div>

                <div className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {lesson.summary}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}