"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardStats } from "@/components/DashboardStats";
import { FocusQueue } from "@/components/FocusQueue";
import { TrackList } from "@/components/TrackList";

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

const LESSON_GOAL = 2;
const QUIZ_GOAL = 2;

export default function HomeDashboard({ tracks }: HomeDashboardProps) {
  const [search, setSearch] = useState("");
  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    tracks.forEach((track, index) => {
      initial[track.track] = index === 0;
    });
    return initial;
  });

  const {
    isLoaded,
    totalLessons,
    completedLessons,
    quizPassedLessons,
    masteredLessons,
    firstIncompleteLesson,
    focusQueue,
    todayLessonsCompleted,
    todayQuizzesPassed,
    streak,
  } = useDashboardStats(tracks);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredTracks = useMemo(() => {
    if (!normalizedSearch) return tracks;

    return tracks
      .map((track) => {
        const trackMatches =
          track.title.toLowerCase().includes(normalizedSearch) ||
          track.description.toLowerCase().includes(normalizedSearch);

        const filteredLessons = track.lessons.filter(
          (lesson) =>
            lesson.title.toLowerCase().includes(normalizedSearch) ||
            lesson.summary.toLowerCase().includes(normalizedSearch) ||
            lesson.track.toLowerCase().includes(normalizedSearch)
        );

        if (trackMatches) return track;
        if (filteredLessons.length > 0) return { ...track, lessons: filteredLessons };
        return null;
      })
      .filter((track): track is Track => track !== null);
  }, [tracks, normalizedSearch]);

  const toggleTrack = (trackKey: string) => {
    setOpenTracks((prev) => ({ ...prev, [trackKey]: !prev[trackKey] }));
  };

  const lessonGoalPercent = Math.min(
    100,
    Math.round((todayLessonsCompleted / LESSON_GOAL) * 100)
  );
  const quizGoalPercent = Math.min(
    100,
    Math.round((todayQuizzesPassed / QUIZ_GOAL) * 100)
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      {/* Hero */}
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
          cross-platform issues, and developer experience -- with hands-on labs
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

        <DashboardStats
          trackCount={tracks.length}
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          quizPassedLessons={quizPassedLessons}
          masteredLessons={masteredLessons}
          firstIncompleteLesson={firstIncompleteLesson}
          isLoaded={isLoaded}
        />
      </section>

      {/* Daily goals, streak, automation */}
      {isLoaded && (
        <section className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Daily Goals
            </h2>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span>Lessons completed today</span>
                <span>{todayLessonsCompleted} / {LESSON_GOAL}</span>
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
                <span>{todayQuizzesPassed} / {QUIZ_GOAL}</span>
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
              Keep momentum by completing at least {LESSON_GOAL} lessons and
              passing {QUIZ_GOAL} quizzes today.
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

      {/* Focus queue */}
      {isLoaded && <FocusQueue items={focusQueue} />}

      {/* Track list */}
      <section className="mt-8 lg:mt-10">
        <TrackList
          tracks={filteredTracks}
          openTracks={openTracks}
          onToggleTrack={toggleTrack}
          isSearching={Boolean(normalizedSearch)}
        />
      </section>
    </main>
  );
}
