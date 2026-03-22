export const trackMeta = {
  title: "Cross-Platform Compatibility",
  description:
    "How differences between Windows, Linux, and macOS affect CLI tools -- including path handling, shell behavior, and environment assumptions that commonly cause cross-platform failures.",
};

export const lessons = [
  {
    slug: "file-path-differences",
    title: "File Path Differences",
    order: 1,
    summary:
      "Compare path syntax, separators, and path-handling pitfalls between Windows, Linux, and macOS.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "newline-differences",
    title: "Newline Differences",
    order: 2,
    summary:
      "Understand how line endings differ across platforms and why that breaks scripts and tooling.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "cross-platform-differences",
    title: "Cross-Platform Differences",
    order: 3,
    summary:
      "A comprehensive look at shell behavior, environment, and filesystem differences that affect CLI tools across Windows, macOS, and Linux.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
] as const;
