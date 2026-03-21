export const trackMeta = {
  title: "CLI Architecture",
  description:
    "How CLI tools are structured and executed — including argument parsing, config precedence, environment interaction, and how design decisions affect debugging and cross-platform behavior.",
};

export const lessons = [

  {
    slug: "argument-parsing",
    title: "Argument Parsing",
    order: 1,
    summary:
      "Understand how CLI tools interpret flags, subcommands, and positional arguments across platforms.",
  },
  {
    slug: "config-precedence",
    title: "Config Precedence",
    order: 2,
    summary:
      "Learn how CLI tools resolve defaults, config files, environment variables, and command-line flags.",
  },
] as const;