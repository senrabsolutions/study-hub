"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RapidPractice from "@/components/RapidPractice";
import {
  type RapidPracticeMode,
  type RapidQuestion,
} from "@/lib/rapid-practice";

type RapidPracticeProgress = {
  attempts: number;
  correct: number;
  streak: number;
};

type RapidPracticeTrackArgs = {
  mode: RapidPracticeMode;
  question: RapidQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
};

const STORAGE_KEY = "rapid-practice-progress";

const EMPTY_PROGRESS: RapidPracticeProgress = {
  attempts: 0,
  correct: 0,
  streak: 0,
};

export default function RapidPage() {
  const [progress, setProgress] = useState<RapidPracticeProgress>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<RapidPracticeProgress>;

        setProgress({
          attempts: parsed.attempts ?? 0,
          correct: parsed.correct ?? 0,
          streak: parsed.streak ?? 0,
        });
      }
    } catch {
      setProgress(EMPTY_PROGRESS);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, hydrated]);

  const trackRapidPractice = ({
    mode,
    question,
    selectedAnswer,
    isCorrect,
  }: RapidPracticeTrackArgs) => {
    setProgress((prev) => ({
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
    }));

    console.log("Rapid practice event:", {
      mode,
      question: question.prompt,
      selectedAnswer,
      isCorrect,
    });
  };

  const resetSavedProgress = () => {
    setProgress(EMPTY_PROGRESS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(EMPTY_PROGRESS));
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            ← Home
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading practice progress...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          ← Home
        </Link>

        <button
          type="button"
          onClick={resetSavedProgress}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
        >
          Reset Saved Progress
        </button>
      </div>

      <RapidPractice progress={progress} track={trackRapidPractice} />
    </main>
  );
}