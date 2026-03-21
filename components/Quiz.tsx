"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useProgress } from "@/components/ProgressProvider";
import { makeLessonKey } from "@/lib/progress";

type QuizProps = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

function getLessonKeyFromPathname(pathname: string | null) {
  if (!pathname) return null;

  const parts = pathname.split("/").filter(Boolean);

  if (parts.length >= 3 && parts[0] === "tracks") {
    const track = parts[1];
    const lessonSlug = parts[2];
    return makeLessonKey(track, lessonSlug);
  }

  return null;
}

export default function Quiz({
  question,
  options,
  answer,
  explanation,
}: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pathname = usePathname();
  const lessonKey = getLessonKeyFromPathname(pathname);

  const { progress, markQuizPassed, clearQuizPassed } = useProgress();

  const isAlreadyPassed = lessonKey
    ? (progress[lessonKey]?.quizPassed ?? false)
    : false;

  const isCorrect = selected === answer;

  const handleSubmit = () => {
    setSubmitted(true);

    if (!lessonKey) return;

    if (selected === answer) {
      markQuizPassed(lessonKey);
    } else {
      clearQuizPassed(lessonKey);
    }
  };

  const getOptionClassName = (option: string) => {
    const isSelected = selected === option;

    return [
      "block w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 transition sm:text-base",
      isSelected
        ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-200"
        : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
      submitted && option === answer
        ? "border-green-500 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-950 dark:text-green-200"
        : "",
      submitted && isSelected && option !== answer
        ? "border-red-500 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-200"
        : "",
    ].join(" ");
  };

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Quick Check
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">
          {question}
        </h3>
      </div>

      {isAlreadyPassed && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          Quiz already passed for this lesson.
        </div>
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (!submitted) {
                setSelected(option);
              }
            }}
            className={getOptionClassName(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {!submitted ? (
          <button
            type="button"
            disabled={!selected}
            onClick={handleSubmit}
            className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
            }}
            className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Try Again
          </button>
        )}
      </div>

      {submitted && (
        <div
          className={`mt-5 rounded-xl border px-4 py-4 text-sm ${
            isCorrect
              ? "border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          <p className="font-semibold">
            {isCorrect
              ? "Correct."
              : `Not quite. The correct answer is: ${answer}`}
          </p>

          {explanation && (
            <p className="mt-2 leading-6 text-gray-700 dark:text-gray-300">
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}