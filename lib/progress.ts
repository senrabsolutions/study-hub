import type { TrackKey } from "@/content/track";

export type LessonProgress = {
  completed: boolean;
  completedAt?: string;

  quizPassed?: boolean;
  quizPassedAt?: string;
  quizScore?: number;
};

export type ProgressMap = Record<string, LessonProgress>;

/**
 * Generates a unique key for a lesson
 * Format: "track/slug"
 */
export function makeLessonKey(track: TrackKey | string, slug: string) {
  return `${track}/${slug}`;
}