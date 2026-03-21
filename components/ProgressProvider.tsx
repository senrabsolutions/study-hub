"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type ProgressMap } from "@/lib/progress";

type ProgressContextType = {
  progress: ProgressMap;
  isLoaded: boolean;
  markComplete: (lessonKey: string) => void;
  markIncomplete: (lessonKey: string) => void;
  markQuizPassed: (lessonKey: string) => void;
  clearQuizPassed: (lessonKey: string) => void;
  setQuizResult: (lessonKey: string, score: number, passed: boolean) => void;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

const STORAGE_KEY = "study-hub-progress";

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setProgress(JSON.parse(raw) as ProgressMap);
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [progress, isLoaded]);

  const markComplete = (lessonKey: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        completed: true,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  const markIncomplete = (lessonKey: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        completed: false,
      },
    }));
  };

  const markQuizPassed = (lessonKey: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        quizPassed: true,
        quizPassedAt: new Date().toISOString(),
      },
    }));
  };

  const clearQuizPassed = (lessonKey: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        quizPassed: false,
      },
    }));
  };

  const setQuizResult = (
    lessonKey: string,
    score: number,
    passed: boolean
  ) => {
    setProgress((prev) => ({
      ...prev,
      [lessonKey]: {
        ...prev[lessonKey],
        quizScore: score,
        quizPassed: passed,
        quizPassedAt: passed
          ? new Date().toISOString()
          : prev[lessonKey]?.quizPassedAt,
      },
    }));
  };

  const value = useMemo(
    () => ({
      progress,
      isLoaded,
      markComplete,
      markIncomplete,
      markQuizPassed,
      clearQuizPassed,
      setQuizResult,
    }),
    [progress, isLoaded]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }

  return context;
}