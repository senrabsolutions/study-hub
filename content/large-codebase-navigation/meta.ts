export const trackMeta = {
  title: "Large Codebase Navigation",
  description:
    "How to understand and work within unfamiliar codebases -- including tracing execution, identifying entry points, and safely debugging and contributing without full context.",
};

export const lessons = [
  {
    slug: "navigating-large-codebases",
    title: "Navigating Large Codebases",
    order: 1,
    summary:
      "Build a method for exploring large repositories, finding entry points, and orienting yourself quickly.",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    slug: "reading-unfamiliar-code",
    title: "Reading Unfamiliar Code",
    order: 2,
    summary:
      "Build a method for exploring large repositories, tracing execution flow, and contributing safely.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "tracing-execution-flow",
    title: "Tracing Execution Flow",
    order: 3,
    summary:
      "Practice following how control moves through an unfamiliar codebase.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
