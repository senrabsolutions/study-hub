export const trackMeta = {
  title: "PowerShell Automation",
  description:
    "How PowerShell executes scripts, interacts with native binaries, and automates Windows workflows — including execution policies, argument handling, and common pitfalls in CLI tooling.",
};

export const lessons = [

  {
    slug: "execution-policy",
    title: "Execution Policy",
    order: 1,
    summary:
      "Learn how PowerShell execution policies affect script behavior, automation, and troubleshooting on Windows.",
  },
  {
    slug: "calling-native-binaries",
    title: "Calling Native Binaries",
    order: 2,
    summary:
      "Learn how PowerShell invokes native executables and where argument handling can become tricky.",
  },
] as const;