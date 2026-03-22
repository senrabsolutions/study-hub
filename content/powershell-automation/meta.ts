export const trackMeta = {
  title: "PowerShell Automation",
  description:
    "How PowerShell executes scripts, interacts with native binaries, and automates Windows workflows -- including execution policies, argument handling, and common pitfalls in CLI tooling.",
};

export const lessons = [
  {
    slug: "execution-policies",
    title: "Execution Policies",
    order: 1,
    summary:
      "Learn how PowerShell execution policies affect script behavior, automation, and troubleshooting on Windows.",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    slug: "calling-native-binaries",
    title: "Calling Native Binaries",
    order: 2,
    summary:
      "Learn how PowerShell invokes native executables and where argument handling can become tricky.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "powershell-pipeline-behavior",
    title: "PowerShell Pipeline Behavior",
    order: 3,
    summary:
      "Understand how PowerShell pipelines pass objects rather than text, and why that changes how you work with native tools.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
