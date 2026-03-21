export const trackMeta = {
  title: "Large Codebase Navigation",
  description:
    "How to understand and work within unfamiliar codebases — including tracing execution, identifying entry points, and safely debugging and contributing without full context.",
};

export const lessons = [

  {
    slug: "reading-unfamiliar-code",
    title: "Reading Unfamiliar Code",
    order: 1,
    summary:
      "Build a method for exploring large repositories, tracing execution flow, and contributing safely.",
  },
  {
    slug: "tracing-execution-flow",
    title: "Tracing Execution Flow",
    order: 2,
    summary:
      "Practice following how control moves through an unfamiliar codebase.",
  },
] as const;