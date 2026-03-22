import { useMemo } from "react";
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

export type FocusItem = {
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

export function getStreakFromDates(dateKeys: string[]): number {
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

export function useDashboardStats(tracks: Track[]) {
  const { progress, isLoaded } = useProgress();

  const allLessons = useMemo(
    () => tracks.flatMap((track) => track.lessons),
    [tracks]
  );

  const totalLessons = useMemo(
    () => tracks.reduce((sum, track) => sum + track.lessons.length, 0),
    [tracks]
  );

  const completedLessons = useMemo(
    () =>
      allLessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return progress[key]?.completed;
      }).length,
    [allLessons, progress]
  );

  const quizPassedLessons = useMemo(
    () =>
      allLessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return progress[key]?.quizPassed;
      }).length,
    [allLessons, progress]
  );

  const masteredLessons = useMemo(
    () =>
      allLessons.filter((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        const item = progress[key];
        return Boolean(item?.completed && item?.quizPassed);
      }).length,
    [allLessons, progress]
  );

  const firstIncompleteLesson = useMemo(
    () =>
      allLessons.find((lesson) => {
        const key = makeLessonKey(lesson.track, lesson.slug);
        return !progress[key]?.completed;
      }) ?? null,
    [allLessons, progress]
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
        if (typeof quizScore === "number" && !quizPassed) priority = 3;
        else if (!completed) priority = 2;
        else if (completed && !quizPassed) priority = 1;

        return priority > 0 ? { lesson, priority } : null;
      })
      .filter((item): item is FocusItem => item !== null)
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.lesson.order - b.lesson.order;
      })
      .slice(0, 5);
  }, [allLessons, isLoaded, progress]);

  const todayLessonsCompleted = useMemo(
    () => Object.values(progress).filter((item) => isSameDay(item.completedAt)).length,
    [progress]
  );

  const todayQuizzesPassed = useMemo(
    () => Object.values(progress).filter((item) => isSameDay(item.quizPassedAt)).length,
    [progress]
  );

  const streak = useMemo(() => {
    const dates = Object.values(progress)
      .flatMap((item) => [item.completedAt, item.quizPassedAt])
      .filter((v): v is string => Boolean(v))
      .map((v) => toDateKey(new Date(v)));
    return getStreakFromDates(dates);
  }, [progress]);

  return {
    isLoaded,
    progress,
    totalLessons,
    completedLessons,
    quizPassedLessons,
    masteredLessons,
    firstIncompleteLesson,
    focusQueue,
    todayLessonsCompleted,
    todayQuizzesPassed,
    streak,
  };
}
