export const trackMeta = {
  title: "TypeScript + Node CLI",
  description:
    "How to build and ship production-ready CLI tools with Node.js and TypeScript — including command structure, packaging, distribution, and how design decisions impact real-world usage and debugging.",
};

export const lessons = [
  {
    slug: "building-a-cli",
    title: "Building a CLI with TypeScript and Node.js",
    order: 1,
    summary:
      "Learn how Node CLI tools are structured — entry points, bin wrappers, exit codes, stdout vs stderr, and why each matters on Windows.",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    slug: "cli-frameworks",
    title: "CLI Frameworks: Commander, Yargs, and Oclif",
    order: 2,
    summary:
      "Compare the major Node CLI frameworks, understand how argument parsing works under the hood, and learn how Windows shell quoting affects your tool.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "packaging-and-distribution",
    title: "Packaging and Distributing a CLI on Windows",
    order: 3,
    summary:
      "How npm wrappers work on Windows, common install failure patterns, winget and Chocolatey distribution, and how to diagnose PATH and permission problems.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
  {
    slug: "commander-internals",
    title: "Commander Internals: How Argument Parsing Actually Works",
    order: 4,
    summary:
      "The three-stage pipeline from user input to handler, how Windows shells transform arguments before Node sees them, and how to diagnose parsing bugs.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
  {
    slug: "bun-vs-node",
    title: "Bun vs Node.js for CLI Tools",
    order: 5,
    summary:
      "Startup time, native TypeScript support, subprocess behavior differences, and why Bun's Windows maturity matters for a tool like Claude Code.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
