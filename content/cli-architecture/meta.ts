export const trackMeta = {
  title: "CLI Architecture",
  description:
    "How CLI tools are structured and executed -- including argument parsing, config precedence, environment interaction, and how design decisions affect debugging and cross-platform behavior.",
};

export const lessons = [
  {
    slug: "cli-argument-parsing",
    title: "Argument Parsing",
    order: 1,
    summary:
      "Understand how CLI tools interpret flags, subcommands, and positional arguments across platforms.",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    slug: "config-precedence",
    title: "Config Precedence",
    order: 2,
    summary:
      "Learn how CLI tools resolve defaults, config files, environment variables, and command-line flags.",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    slug: "subprocess-spawning",
    title: "Subprocess Spawning",
    order: 3,
    summary:
      "How CLI tools launch child processes, inherit environment, and handle output on Windows.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "terminal-io",
    title: "Terminal I/O",
    order: 4,
    summary:
      "How CLI tools read input and write output -- including stdin, stdout, stderr, and TTY detection.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
