export const trackMeta = {
  title: "macOS for Windows Admins",
  description:
    "macOS equivalents of every Windows admin tool you know -- shell, package management, process management, permissions, and developer workflow for engineers joining a Mac-first team.",
};

export const lessons = [
  {
    slug: "macos-shell-and-environment",
    title: "macOS Shell and Environment",
    order: 1,
    summary:
      "zsh vs PowerShell, Homebrew vs winget, PATH configuration, and environment variables on macOS -- everything a Windows admin needs to orient quickly.",
    duration: "20 min",
    difficulty: "Beginner",
  },
  {
    slug: "macos-process-and-system",
    title: "macOS Process and System Management",
    order: 2,
    summary:
      "Activity Monitor, ps, kill, lsof, launchctl, and brew services -- the macOS equivalents of Task Manager, taskkill, netstat, and Windows Services.",
    duration: "20 min",
    difficulty: "Beginner",
  },
  {
    slug: "macos-permissions-and-security",
    title: "macOS Permissions and Security",
    order: 3,
    summary:
      "Unix permissions, sudo, SIP, Gatekeeper, and TCC -- the security layers that replace and extend Windows ACLs and UAC on macOS.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
  {
    slug: "macos-developer-tools",
    title: "macOS Developer Tools and Workflow",
    order: 4,
    summary:
      "Xcode CLT, Git with Keychain, Node via nvm, VS Code, cron, and the terminal tools every Anthropic engineer uses daily.",
    duration: "20 min",
    difficulty: "Intermediate",
  },
] as const;
