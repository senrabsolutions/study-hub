export const trackMeta = {
  title: "AI Tooling + CLI Workflows",
  description:
    "How AI-assisted tools integrate into real CLI workflows — including prompt-driven execution, tool invocation patterns, and maintaining safety, control, and developer intent.",
};

export const lessons = [
  {
    slug: "ai-assisted-cli-workflows",
    title: "AI-Assisted CLI Workflows",
    order: 1,
    summary:
      "How AI tools support terminal-based development workflows, why validation matters, and how shell context affects AI-generated commands on Windows.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "how-claude-code-works",
    title: "How Claude Code Works: The AI Engine Behind the CLI",
    order: 2,
    summary:
      "The agentic loop, tool use, context windows, and the system prompt — how Claude Code communicates with the model and why Windows engineering lives in the tool layer.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
  {
    slug: "tool-invocation-patterns",
    title: "Tool Invocation Patterns in Claude Code",
    order: 3,
    summary:
      "How tools are defined, invoked, and validated — including safety patterns, Windows-specific file and command handling, and parallel tool call concerns.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
  {
    slug: "context-management",
    title: "Context Management and Session State",
    order: 4,
    summary:
      "Why Windows sessions hit context limits faster, strategies for managing context pressure, and how session state requires explicit engineering on Windows.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
