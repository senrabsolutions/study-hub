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

type Track = {
  track: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type HomeDashboardProps = {
  tracks: Track[];
};

type FocusItem = {
  lesson: Lesson;
  priority: 1 | 2 | 3;
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isSameDay(iso?: string) {
  if (!iso) return false;
  return toDateKey(new Date(iso)) === toDateKey(new Date());
}

function getStreakFromDates(dateKeys: string[]) {
  if (dateKeys.length === 0) return 0;

  const uniqueSorted = [...new Set(dateKeys)].sort().reverse();
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueSorted.length; i++) {
    const expected = toDateKey(cursor);

    if (uniqueSorted[i] === expected) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);

      if (uniqueSorted[i] === toDateKey(yesterday)) {
        streak += 1;
        cursor.setTime(yesterday.getTime());
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

export default function HomeDashboard({ tracks }: HomeDashboardProps) {
  const { progress, isLoaded } = useProgress();
  const [search, setSearch] = useState("");

  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    tracks.forEach((track, index) => {
      initial[track.track] = index === 0;
    });
    return initial;
  });

  const toggleTrack = (trackKey: string) => {
    setOpenTracks((prev) => ({
      ...prev,
      [trackKey]: !prev[trackKey],
    }));
  };

  const normalizedSearch = search.trim().toLowerCase();

  const allLessons = useMemo(
    () => tracks.flatMap((track) => track.lessons),
    [tracks]
  );

  const focusQueue = useMemo<FocusItem[]>(() => {
    if (!isLoaded) return [];

    return allLessons
      .map((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        const item = progress[key];
        const completed = item?.completed ?? false;
        const quizPassed = item?.quizPassed ?? false;
        const quizScore = item?.quizScore;

        let priority: 1 | 2 | 3 | 0 = 0;

        if (typeof quizScore === "number" && !quizPassed) {
          priority = 3;
        } else if (!completed) {
          priority = 2;
        } else if (completed && !quizPassed) {
          priority = 1;
        }

        return priority > 0 ? { lesson, priority } : null;
      })
      .filter((item): item is FocusItem => item !== null)
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.lesson.order - b.lesson.order;
      })
      .slice(0, 5);
  }, [allLessons, isLoaded, progress]);

  const filteredTracks = useMemo(() => {
    if (!normalizedSearch) return tracks;

    return tracks
      .map((track) => {
        const trackMatches =
          track.title.toLowerCase().includes(normalizedSearch) ||
          track.description.toLowerCase().includes(normalizedSearch);

        const filteredLessons = track.lessons.filter((lesson) => {
          return (
            lesson.title.toLowerCase().includes(normalizedSearch) ||
            lesson.summary.toLowerCase().includes(normalizedSearch) ||
            lesson.track.toLowerCase().includes(normalizedSearch)
          );
        });

        if (trackMatches) return track;

        if (filteredLessons.length > 0) {
          return { ...track, lessons: filteredLessons };
        }

        return null;
      })
      .filter((track): track is Track => track !== null);
  }, [tracks, normalizedSearch]);

  const totalLessons = tracks.reduce(
    (sum, track) => sum + track.lessons.length,
    0
  );

  const completedLessons = tracks.reduce((sum, track) => {
    return (
      sum +
      track.lessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return progress[key]?.completed;
      }).length
    );
  }, 0);

  const quizPassedLessons = tracks.reduce((sum, track) => {
    return (
      sum +
      track.lessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return progress[key]?.quizPassed;
      }).length
    );
  }, 0);

  const masteredLessons = tracks.reduce((sum, track) => {
    return (
      sum +
      track.lessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        const item = progress[key];
        return Boolean(item?.completed && item?.quizPassed);
      }).length
    );
  }, 0);

  const firstIncompleteLesson =
    tracks
      .flatMap((track) => track.lessons)
      .find((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return !progress[key]?.completed;
      }) ?? null;

  const todayLessonsCompleted = Object.values(progress).filter((item) =>
    isSameDay(item.completedAt)
  ).length;

  const todayQuizzesPassed = Object.values(progress).filter((item) =>
    isSameDay(item.quizPassedAt)
  ).length;

  const activityDates = Object.values(progress)
    .flatMap((item) => [item.completedAt, item.quizPassedAt])
    .filter((value): value is string => Boolean(value))
    .map((value) => toDateKey(new Date(value)));

  const streak = getStreakFromDates(activityDates);

  const lessonGoal = 2;
  const quizGoal = 2;

  const lessonGoalPercent = Math.min(
    100,
    Math.round((todayLessonsCompleted / lessonGoal) * 100)
  );

  const quizGoalPercent = Math.min(
    100,
    Math.round((todayQuizzesPassed / quizGoal) * 100)
  );

  const getFocusLabel = (priority: 1 | 2 | 3) => {
    if (priority === 3) return "Review Quiz";
    if (priority === 2) return "Start Lesson";
    return "Finish Mastery";
  };

  const getFocusLabelClass = (priority: 1 | 2 | 3) => {
    if (priority === 3) {
      return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    }
    if (priority === 2) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
    }
    return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Study Hub
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Windows CLI Engineering Study Platform
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          An interactive, scenario-driven learning system focused on real-world
          CLI behavior, debugging workflows, and Windows platform nuances.
        </p>

        <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
          Covers PATH resolution, subprocess execution, PowerShell behavior,
          cross-platform issues, and developer experience — with hands-on labs
          and interview-focused explanations.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
            Real-world debugging scenarios
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-200">
            Interactive quizzes
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
            Interview-focused learning
          </span>
        </div>

        <div className="mt-6">
          <label
            htmlFor="lesson-search"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search lessons and tracks
          </label>

          <input
            id="lesson-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PATH, PowerShell, packaging, CLI..."
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tracks</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {tracks.length}
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
                ? firstIncompleteLesson?.title ??
                  "All available lessons completed"
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
      </section>

      {isLoaded && (
        <section className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Daily Goals
            </h2>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span>Lessons completed today</span>
                <span>
                  {todayLessonsCompleted} / {lessonGoal}
                </span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div
                  className="h-full bg-green-600 dark:bg-green-500"
                  style={{ width: `${lessonGoalPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span>Quizzes passed today</span>
                <span>
                  {todayQuizzesPassed} / {quizGoal}
                </span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500"
                  style={{ width: `${quizGoalPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Streak
            </h2>
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
              {streak}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {streak === 1 ? "day of activity" : "days of activity"}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Today
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Keep momentum by completing at least {lessonGoal} lessons and
              passing {quizGoal} quizzes today.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-300 bg-purple-50 p-5 shadow-sm sm:p-6 dark:border-purple-800 dark:bg-purple-950 dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Automation Drills
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
              Practice building PowerShell functions, cmdlets, and real-world
              Windows automation workflows.
            </p>

            <div className="mt-5">
              <Link
                href="/automation"
                className="inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400"
              >
                Start Building →
              </Link>
            </div>
          </div>
        </section>
      )}

      {isLoaded && focusQueue.length > 0 && (
        <section className="mt-8 rounded-3xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm sm:p-6 lg:mt-10 dark:border-yellow-800 dark:bg-yellow-950 dark:shadow-none">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Focus Queue
          </h2>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            Based on your progress, here’s what to work on next.
          </p>

          <div className="mt-4 space-y-3">
            {focusQueue.map(({ lesson, priority }) => (
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
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getFocusLabelClass(
                    priority
                  )}`}
                >
                  {getFocusLabel(priority)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 space-y-6 lg:mt-10">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => {
            const isOpen = normalizedSearch ? true : openTracks[track.track];

            const completedCount = track.lessons.filter((lesson) => {
              const key = makeLessonKey(lesson.track, lesson.slug);
              return progress[key]?.completed;
            }).length;

            const quizPassedCount = track.lessons.filter((lesson) => {
              const key = makeLessonKey(lesson.track, lesson.slug);
              return progress[key]?.quizPassed;
            }).length;

            const masteredCount = track.lessons.filter((lesson) => {
              const key = makeLessonKey(lesson.track, lesson.slug);
              const item = progress[key];
              return Boolean(item?.completed && item?.quizPassed);
            }).length;

            const progressPercent = track.lessons.length
              ? (masteredCount / track.lessons.length) * 100
              : 0;

            return (
              <div
                key={track.track}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <button
                    type="button"
                    onClick={() => toggleTrack(track.track)}
                    className="flex flex-1 items-start justify-between gap-4 text-left"
                  >
                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {track.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                        {track.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xl text-gray-400 dark:text-gray-500">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <Link
                    href={`/tracks/${track.track}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Open Track →
                  </Link>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {isLoaded
                    ? `${completedCount} / ${track.lessons.length} completed • ${quizPassedCount} / ${track.lessons.length} quizzes passed • ${masteredCount} / ${track.lessons.length} mastered`
                    : "Loading progress"}
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full bg-purple-600 dark:bg-purple-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {isOpen && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {track.lessons.length > 0 ? (
                      track.lessons.map((lesson) => {
                        const key = makeLessonKey(lesson.track, lesson.slug);
                        const item = progress[key];
                        const isCompleted = item?.completed ?? false;
                        const quizPassed = item?.quizPassed ?? false;
                        const isMastered = Boolean(
                          item?.completed && item?.quizPassed
                        );

                        return (
                          <Link
                            key={lesson.slug}
                            href={`/tracks/${lesson.track}/${lesson.slug}`}
                            className="block rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-white sm:p-5 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Lesson {lesson.order}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {lesson.title}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  <span className="rounded bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {lesson.duration ?? "10 min"}
                                  </span>
                                  <span className="rounded bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {lesson.difficulty ?? "Beginner"}
                                  </span>
                                </div>
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

                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                              {lesson.summary}
                            </p>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 md:col-span-2">
                        Lessons for this track are coming soon.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:shadow-none">
            No tracks or lessons matched your search.
          </div>
        )}
      </section>
    </main>
  );
}