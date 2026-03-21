export const trackMeta = {
  title: "Windows Internals",
  description:
    "How Windows actually resolves commands, manages environment variables, and launches processes — the underlying behavior that explains PATH issues, shell differences, and CLI debugging on Windows.",
};

export const lessons = [

  {
    slug: "path-resolution",
    title: "PATH Resolution on Windows",
    order: 1,
    summary:
      "Learn how Windows finds executables using PATH, PATHEXT, and inherited environment variables across shells and process contexts.",
  },
  {
    slug: "cmd-vs-powershell",
    title: "CMD vs PowerShell",
    order: 2,
    summary:
      "Compare how CMD and PowerShell differ in variable syntax, quoting, command discovery, and shell behavior.",
  },
  {
    slug: "environment-inheritance",
    title: "Environment Inheritance",
    order: 3,
    summary:
      "Learn how child processes inherit environment variables and why that affects CLI behavior.",
  },
] as const;