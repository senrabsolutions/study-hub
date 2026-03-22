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

type Track = {
  track: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type TrackListProps = {
  tracks: Track[];
  openTracks: Record<string, boolean>;
  onToggleTrack: (trackKey: string) => void;
  isSearching: boolean;
};

type LessonCardProps = {
  lesson: Lesson;
};

function LessonCard({ lesson }: LessonCardProps) {
  const { progress } = useProgress();
  const key = makeLessonKey(lesson.track, lesson.slug);
  const item = progress[key];
  const isCompleted = item?.completed ?? false;
  const quizPassed = item?.quizPassed ?? false;
  const isMastered = Boolean(item?.completed && item?.quizPassed);

  return (
    <Link
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
}

type TrackCardProps = {
  track: Track;
  isOpen: boolean;
  onToggle: () => void;
};

function TrackCard({ track, isOpen, onToggle }: TrackCardProps) {
  const { progress, isLoaded } = useProgress();

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
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <button
          type="button"
          onClick={onToggle}
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
            track.lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 md:col-span-2">
              Lessons for this track are coming soon.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TrackList({
  tracks,
  openTracks,
  onToggleTrack,
  isSearching,
}: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:shadow-none">
        No tracks or lessons matched your search.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tracks.map((track) => (
        <TrackCard
          key={track.track}
          track={track}
          isOpen={isSearching ? true : (openTracks[track.track] ?? false)}
          onToggle={() => onToggleTrack(track.track)}
        />
      ))}
    </div>
  );
}
