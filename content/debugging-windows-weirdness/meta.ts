export const trackMeta = {
  title: "Debugging Windows Weirdness",
  description:
    "How to diagnose unpredictable Windows-specific failures -- including PATH conflicts, permission issues, file locking, and shell inconsistencies that cause tools to behave differently across environments.",
};

export const lessons = [
  {
    slug: "path-conflicts",
    title: "PATH Conflicts",
    order: 1,
    summary:
      "Learn how conflicting PATH entries and duplicate tools create hard-to-diagnose Windows CLI issues.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "locked-files",
    title: "Locked Files",
    order: 2,
    summary:
      "Learn why Windows file locking breaks updates, builds, and cleanup operations.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "debugging-platform-issues",
    title: "Debugging Platform Issues",
    order: 3,
    summary:
      "A systematic approach to diagnosing Windows-specific failures -- isolating variables, reading error signals, and finding root causes.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
] as const;
