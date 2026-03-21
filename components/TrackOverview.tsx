"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

type TrackOverviewProps = {
  track: string;
  trackTitle: string;
  trackDescription: string;
  lessons: Lesson[];
};

type FilterMode = "all" | "pending" | "complete" | "quiz" | "mastered";

export default function TrackOverview({
  track,
  trackTitle,
  trackDescription,
  lessons,
}: TrackOverviewProps) {
  const { progress } = useProgress();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const key = makeLessonKey(lesson.track, lesson.slug);
      const item = progress[key];
      const isCompleted = item?.completed ?? false;
      const quizPassed = item?.quizPassed ?? false;
      const isMastered = isCompleted && quizPassed;

      const matchesSearch =
        !normalizedSearch ||
        lesson.title.toLowerCase().includes(normalizedSearch) ||
        lesson.summary.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !isCompleted) ||
        (filter === "complete" && isCompleted) ||
        (filter === "quiz" && quizPassed) ||
        (filter === "mastered" && isMastered);

      return matchesSearch && matchesFilter;
    });
  }, [lessons, progress, normalizedSearch, filter]);

  const totalLessons = lessons.length;

  const completedCount = lessons.filter((lesson) => {
    const key = makeLessonKey(lesson.track, lesson.slug);
    return progress[key]?.completed;
  }).length;

  const quizPassedCount = lessons.filter((lesson) => {
    const key = makeLessonKey(lesson.track, lesson.slug);
    return progress[key]?.quizPassed;
  }).length;

  const masteredCount = lessons.filter((lesson) => {
    const key = makeLessonKey(lesson.track, lesson.slug);
    const item = progress[key];
    return Boolean(item?.completed && item?.quizPassed);
  }).length;

  const filterButtonClass = (mode: FilterMode) =>
    [
      "rounded-xl px-3 py-2 text-sm font-medium transition",
      "whitespace-nowrap",
      filter === mode
        ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
    ].join(" ");

  return (
    <section>
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Track Overview
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          {trackTitle}
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          {trackDescription}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completedCount} / {totalLessons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quiz Passed
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {quizPassedCount} / {totalLessons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Mastered</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {masteredCount} / {totalLessons}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor={`track-search-${track}`}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search this track
          </label>

          <input
            id={`track-search-${track}`}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons in this track..."
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={filterButtonClass("all")}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={filterButtonClass("pending")}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setFilter("complete")}
            className={filterButtonClass("complete")}
          >
            Complete
          </button>
          <button
            type="button"
            onClick={() => setFilter("quiz")}
            className={filterButtonClass("quiz")}
          >
            Quiz Passed
          </button>
          <button
            type="button"
            onClick={() => setFilter("mastered")}
            className={filterButtonClass("mastered")}
          >
            Mastered
          </button>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-gray-600 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:shadow-none">
          No lessons matched your current search or filter.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLessons.map((lesson) => {
            const key = makeLessonKey(lesson.track, lesson.slug);
            const item = progress[key];
            const isCompleted = item?.completed ?? false;
            const quizPassed = item?.quizPassed ?? false;
            const isMastered = Boolean(item?.completed && item?.quizPassed);

            return (
              <Link
                key={lesson.slug}
                href={`/tracks/${lesson.track}/${lesson.slug}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none dark:hover:bg-gray-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Lesson {lesson.order}
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-gray-100">
                      {lesson.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {lesson.duration ?? "10 min"}
                      </span>
                      <span className="rounded bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {lesson.difficulty ?? "Beginner"}
                      </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="flex flex-row flex-wrap gap-2 sm:flex-col sm:flex-nowrap">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isCompleted
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {isCompleted ? "Complete" : "Pending"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        quizPassed
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {quizPassed ? "Quiz Passed" : "Quiz Pending"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isMastered
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {isMastered ? "Mastered" : "Learning"}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white dark:bg-blue-500">
                    Open Lesson →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}