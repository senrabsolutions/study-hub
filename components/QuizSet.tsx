"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useProgress } from "@/components/ProgressProvider";
import { makeLessonKey } from "@/lib/progress";

type QuizSetQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuizSetProps = {
  questions: QuizSetQuestion[];
  title?: string;
  description?: string;
  passPercent?: number;
  passPercentage?: number;
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

export default function QuizSet({
  questions,
  title = "Lesson Quiz",
  description = "Complete all questions to check your understanding.",
  passPercent,
  passPercentage,
}: QuizSetProps) {
  const resolvedPassPercent = passPercent ?? passPercentage ?? 80;

  const pathname = usePathname();
  const lessonKey = getLessonKeyFromPathname(pathname);

  const { progress, setQuizResult } = useProgress();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const correctCount = useMemo(() => {
    return questions.reduce((sum, item, index) => {
      return sum + (selectedAnswers[index] === item.answer ? 1 : 0);
    }, 0);
  }, [questions, selectedAnswers]);

  const score = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((correctCount / questions.length) * 100);
  }, [correctCount, questions.length]);

  const passed = score >= resolvedPassPercent;

  const savedQuizScore = lessonKey ? progress[lessonKey]?.quizScore : undefined;
  const isAlreadyPassed = lessonKey
    ? (progress[lessonKey]?.quizPassed ?? false)
    : false;

  const handleSelect = (questionIndex: number, option: string) => {
    if (submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;

    setSubmitted(true);

    if (!lessonKey) return;

    setQuizResult(lessonKey, score, passed);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const getOptionClassName = (
    questionIndex: number,
    option: string,
    answer: string
  ) => {
    const isSelected = selectedAnswers[questionIndex] === option;
    const isCorrect = option === answer;
    const isWrongSelection = isSelected && option !== answer;

    if (!submitted) {
      return [
        "block w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 transition sm:text-base",
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-200"
          : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
      ].join(" ");
    }

    if (isCorrect) {
      return [
        "block w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 sm:text-base",
        "border-green-500 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-950 dark:text-green-200",
      ].join(" ");
    }

    if (isWrongSelection) {
      return [
        "block w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 sm:text-base",
        "border-red-500 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-200",
      ].join(" ");
    }

    return [
      "block w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 sm:text-base",
      "border-gray-300 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
    ].join(" ");
  };

  if (questions.length === 0) {
    return (
      <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No quiz questions available.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Quiz Set
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {description}
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Pass threshold: {resolvedPassPercent}% (
          {Math.ceil((resolvedPassPercent / 100) * totalQuestions)} of{" "}
          {totalQuestions} correct)
        </p>
      </div>

      {isAlreadyPassed && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          This lesson quiz is already passed
          {typeof savedQuizScore === "number" ? ` (${savedQuizScore}%).` : "."}
        </div>
      )}

      <div className="space-y-5 sm:space-y-6">
        {questions.map((item, questionIndex) => {
          const selected = selectedAnswers[questionIndex];

          return (
            <div
              key={`${questionIndex}-${item.question}`}
              className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Question {questionIndex + 1}
                </p>

                <h4 className="mt-2 text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  {item.question}
                </h4>
              </div>

              <div className="space-y-3">
                {item.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(questionIndex, option)}
                    className={getOptionClassName(
                      questionIndex,
                      option,
                      item.answer
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {submitted && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-4 text-sm ${
                    selected === item.answer
                      ? "border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
                      : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                  }`}
                >
                  <p className="font-semibold">
                    {selected === item.answer
                      ? "Correct."
                      : `Not quite. The correct answer is: ${item.answer}`}
                  </p>

                  {item.explanation && (
                    <p className="mt-2 leading-6 text-gray-700 dark:text-gray-300">
                      {item.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Retry Quiz
          </button>
        )}

        <span className="text-sm text-gray-600 dark:text-gray-300">
          {answeredCount} / {totalQuestions} answered
        </span>
      </div>

      {submitted && (
        <div
          className={`mt-5 rounded-xl border px-4 py-4 text-sm ${
            passed
              ? "border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          <p className="font-semibold">
            {passed ? "Passed." : "Not passed yet."} You scored {correctCount} /{" "}
            {totalQuestions} ({score}%).
          </p>

          <p className="mt-2 leading-6 text-gray-700 dark:text-gray-300">
            {passed
              ? "Nice work. Your lesson quiz progress has been updated."
              : `You need at least ${resolvedPassPercent}% to pass this quiz.`}
          </p>
        </div>
      )}
    </div>
  );
}