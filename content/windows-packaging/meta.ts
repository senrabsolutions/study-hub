export const trackMeta = {
  title: "Windows Packaging",
  description:
    "How CLI tools are installed, versioned, and distributed on Windows -- including package managers, update strategies, and common issues with PATH, permissions, and installation behavior.",
};

export const lessons = [
  {
    slug: "winget-basics",
    title: "winget Basics",
    order: 1,
    summary:
      "Understand the basics of Windows package installation, versioning, and distribution using winget.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "chocolatey-vs-winget",
    title: "Chocolatey vs winget",
    order: 2,
    summary:
      "Compare common Windows package managers and understand where each fits.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "versioning-and-updates",
    title: "Versioning and Updates",
    order: 3,
    summary:
      "How CLI tools handle versioning, update distribution, and migration on Windows.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
