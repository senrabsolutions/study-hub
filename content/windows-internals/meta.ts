export const trackMeta = {
  title: "Windows Internals",
  description:
    "How Windows actually resolves commands, manages environment variables, and launches processes -- the underlying behavior that explains PATH issues, shell differences, and CLI debugging on Windows.",
};

export const lessons = [
  {
    slug: "path-resolution",
    title: "PATH Resolution on Windows",
    order: 1,
    summary:
      "Learn how Windows finds executables using PATH, PATHEXT, and inherited environment variables across shells and process contexts.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "cmd-vs-powershell",
    title: "CMD vs PowerShell",
    order: 2,
    summary:
      "Compare how CMD and PowerShell differ in variable syntax, quoting, command discovery, and shell behavior.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "environment-inheritance",
    title: "Environment Inheritance",
    order: 3,
    summary:
      "Learn how child processes inherit environment variables and why that affects CLI behavior.",
    duration: "10 min",
    difficulty: "Beginner",
  },
  {
    slug: "process-model-overview",
    title: "Process Model Overview",
    order: 4,
    summary:
      "How Windows creates and manages processes, and why that matters for CLI tools and subprocesses.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "acls-and-permissions",
    title: "ACLs and Permissions",
    order: 5,
    summary:
      "How Windows file permissions work and why they cause CLI failures that don't happen on Unix.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
  {
    slug: "registry-basics",
    title: "Registry Basics",
    order: 6,
    summary:
      "What the Windows registry is and how it affects environment variables, PATH, and tool configuration.",
    duration: "15 min",
    difficulty: "Intermediate",
  },
] as const;
