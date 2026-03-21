"use client";

import { useProgress } from "@/components/ProgressProvider";
import { makeLessonKey } from "@/lib/progress";

type LessonProgressButtonProps = {
  track: string;
  slug: string;
};

export default function LessonProgressButton({
  track,
  slug,
}: LessonProgressButtonProps) {
  const { progress, isLoaded, markComplete, markIncomplete } = useProgress();

  const lessonKey = makeLessonKey(track, slug);
  const isCompleted = progress[lessonKey]?.completed ?? false;
  const quizPassed = progress[lessonKey]?.quizPassed ?? false;
  const isMastered = isCompleted && quizPassed;

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Loading progress...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`rounded-xl px-4 py-3 text-sm font-medium ${
          isCompleted
            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
            : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {isCompleted ? "Lesson Complete" : "Lesson Pending"}
      </span>

      <span
        className={`rounded-xl px-4 py-3 text-sm font-medium ${
          quizPassed
            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
            : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {quizPassed ? "Quiz Passed" : "Quiz Pending"}
      </span>

      <span
        className={`rounded-xl px-4 py-3 text-sm font-medium ${
          isMastered
            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
            : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {isMastered ? "Mastered" : "Not Mastered"}
      </span>

      {isCompleted ? (
        <button
          type="button"
          onClick={() => markIncomplete(lessonKey)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Mark Incomplete
        </button>
      ) : (
        <button
          type="button"
          onClick={() => markComplete(lessonKey)}
          className="rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}