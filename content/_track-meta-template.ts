export const trackMeta = {
  title: "Track Title",
  description:
    "Explain the purpose of this track and what skills it develops.",
} as const;

export const lessons = [
  {
    slug: "first-lesson",
    title: "First Lesson",
    order: 1,
    summary:
      "Explain what this lesson teaches and what problem it helps solve.",
    duration: "10 min",
    difficulty: "Beginner",
  },
] as const;