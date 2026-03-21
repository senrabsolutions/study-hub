"use client";

import { useMemo, useState } from "react";
import {
  type RapidPracticeMode,
  type RapidQuestion,
  getQuestionsForMode,
  shuffleQuestions,
} from "@/lib/rapid-practice";

type AnswerState = "idle" | "correct" | "incorrect";

type RapidPracticeProgress = {
  attempts?: number;
  correct?: number;
  streak?: number;
};

type RapidPracticeTrackArgs = {
  mode: RapidPracticeMode;
  question: RapidQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
};

type RapidPracticeProps = {
  progress?: RapidPracticeProgress;
  track?: (args: RapidPracticeTrackArgs) => void;
};

export default function RapidPractice({
  progress,
  track,
}: RapidPracticeProps) {
  const [mode, setMode] = useState<RapidPracticeMode>("scenario");
  const [seed, setSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");

  const questions = useMemo(() => {
    return shuffleQuestions(getQuestionsForMode(mode));
  }, [mode, seed]);

  const currentQuestion = questions[currentIndex];

  const totalAttempts = progress?.attempts ?? 0;
  const totalCorrect = progress?.correct ?? 0;
  const displayStreak = progress?.streak ?? 0;

  const accuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const resetSession = (nextMode?: RapidPracticeMode) => {
    if (nextMode) {
      setMode(nextMode);
    }

    setSeed((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion || answerState !== "idle") return;

    const isCorrect = option === currentQuestion.answer;

    setSelectedAnswer(option);
    setAnswerState(isCorrect ? "correct" : "incorrect");

    track?.({
      mode,
      question: currentQuestion,
      selectedAnswer: option,
      isCorrect,
    });
  };

  const goToNext = () => {
    if (!currentQuestion) return;

    const isLastQuestion = currentIndex >= questions.length - 1;

    if (isLastQuestion) {
      setSeed((prev) => prev + 1);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }

    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  const getOptionClassName = (option: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrect = option === currentQuestion.answer;

    if (answerState === "idle") {
      return [
        "block w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 transition sm:text-base",
        "border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
        "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
      ].join(" ");
    }

    if (isCorrect) {
      return [
        "block w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 sm:text-base",
        "border-green-400 bg-green-50 text-green-900",
        "dark:border-green-800 dark:bg-green-950 dark:text-green-200",
      ].join(" ");
    }

    if (isSelected && !isCorrect) {
      return [
        "block w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 sm:text-base",
        "border-red-400 bg-red-50 text-red-900",
        "dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      ].join(" ");
    }

    return [
      "block w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 sm:text-base",
      "border-gray-300 bg-white text-gray-500",
      "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
    ].join(" ");
  };

  const getModeButtonClass = (buttonMode: RapidPracticeMode) =>
    [
      "rounded-xl px-4 py-2 text-sm font-medium transition",
      "min-h-[44px]",
      mode === buttonMode
        ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
    ].join(" ");

  if (!currentQuestion) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Rapid Practice
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          No questions available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Rapid Practice
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Fast Recall + Debugging Drills
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Practice quick recognition of system behavior, debugging patterns, and
          CLI concepts. Use Scenario Mode for failure diagnosis and Concept Mode
          for fast recall of core ideas.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => resetSession("scenario")}
            className={getModeButtonClass("scenario")}
          >
            Scenario Mode
          </button>

          <button
            type="button"
            onClick={() => resetSession("concept")}
            className={getModeButtonClass("concept")}
          >
            Concept Mode
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Mode</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {mode === "scenario" ? "Scenario" : "Concept"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {totalCorrect} / {totalAttempts}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {accuracy}%
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {displayStreak}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {mode === "scenario" ? "Scenario Drill" : "Concept Drill"}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => resetSession()}
            className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Restart
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl dark:text-gray-100">
            {currentQuestion.prompt}
          </h2>
        </div>

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(option)}
              disabled={answerState !== "idle"}
              className={getOptionClassName(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {answerState !== "idle" && (
          <div
            className={`mt-6 rounded-2xl border p-5 ${
              answerState === "correct"
                ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950"
                : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
            }`}
          >
            <p
              className={`text-base font-semibold ${
                answerState === "correct"
                  ? "text-green-900 dark:text-green-200"
                  : "text-red-900 dark:text-red-200"
              }`}
            >
              {answerState === "correct"
                ? "Correct."
                : `Not quite. The correct answer is: ${currentQuestion.answer}`}
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {currentQuestion.explanation}
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={goToNext}
                className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Next Question →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}