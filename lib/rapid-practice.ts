import type { TrackKey } from "@/content/track";

export type RapidPracticeMode = "scenario" | "concept";

export type RapidTrack = "all" | "weak" | RapidQuestionTrack;

export type RapidQuestionTrack = Extract<
  TrackKey,
  | "windows-internals"
  | "cli-architecture"
  | "powershell-automation"
  | "cross-platform-compatibility"
  | "debugging-windows-weirdness"
  | "developer-experience"
  | "windows-packaging"
>;

export type RapidQuestion = {
  type: RapidPracticeMode;
  track: RapidQuestionTrack;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type RapidProgressItem = {
  completed?: boolean;
  quizPassed?: boolean;
  quizScore?: number;
};

export type RapidProgressMap = Record<string, RapidProgressItem>;

export const rapidTrackLabels: Record<RapidTrack, string> = {
  all: "All Tracks",
  weak: "Weak Areas",
  "windows-internals": "Windows Internals",
  "cli-architecture": "CLI Architecture",
  "powershell-automation": "PowerShell Automation",
  "cross-platform-compatibility": "Cross-Platform Compatibility",
  "debugging-windows-weirdness": "Debugging Windows Weirdness",
  "developer-experience": "Developer Experience",
  "windows-packaging": "Windows Packaging",
};

const rapidQuestions: RapidQuestion[] = [
  {
    type: "scenario",
    track: "windows-internals",
    prompt:
      "A CLI tool works in PowerShell but fails in VS Code with 'command not found'. What is the most likely cause?",
    options: [
      "VS Code blocks subprocesses by default",
      "VS Code inherited an outdated PATH or environment",
      "PowerShell automatically installs missing tools",
      "The CLI tool only supports interactive terminals",
    ],
    answer: "VS Code inherited an outdated PATH or environment",
    explanation:
      "If VS Code was launched before PATH changed, its terminals and child processes may inherit stale environment variables.",
  },
  {
    type: "scenario",
    track: "cli-architecture",
    prompt:
      "A subprocess can run 'git' in your terminal, but the same command fails inside a Node CLI. What should you inspect first?",
    options: [
      "The monitor refresh rate",
      "The parent process PATH and environment",
      "The Windows wallpaper settings",
      "The contents of the recycle bin",
    ],
    answer: "The parent process PATH and environment",
    explanation:
      "Subprocesses inherit environment variables from the parent process, so PATH is one of the first things to verify.",
  },
  {
    type: "scenario",
    track: "windows-internals",
    prompt:
      "A script works as Administrator but fails for a standard user with 'Access denied'. What is the most likely cause?",
    options: [
      "A DNS issue",
      "An ACL or permission difference",
      "A JavaScript syntax error",
      "A browser cache problem",
    ],
    answer: "An ACL or permission difference",
    explanation:
      "If behavior changes between admin and standard user contexts, permissions are a likely cause.",
  },
  {
    type: "scenario",
    track: "cross-platform-compatibility",
    prompt:
      "A script using 'rm -rf dist' works on macOS but fails on Windows. What is the best explanation?",
    options: [
      "Windows does not support deleting folders",
      "The script assumes a Unix shell command that is not native on Windows",
      "Node.js cannot remove files on Windows",
      "PATH does not exist on Windows",
    ],
    answer:
      "The script assumes a Unix shell command that is not native on Windows",
    explanation:
      "Cross-platform issues often come from shell-specific commands like rm, grep, or chmod.",
  },
  {
    type: "scenario",
    track: "powershell-automation",
    prompt:
      "A PowerShell command with quoted arguments behaves differently than the same command in bash. Why?",
    options: [
      "PowerShell parses arguments differently before passing them to native tools",
      "Bash ignores quotes entirely",
      "Windows disables whitespace in arguments",
      "PowerShell only supports cmdlets",
    ],
    answer:
      "PowerShell parses arguments differently before passing them to native tools",
    explanation:
      "PowerShell is not just a text shell; it interprets arguments before handing them off, which can change behavior.",
  },
  {
    type: "scenario",
    track: "windows-packaging",
    prompt:
      "A user installs a CLI tool successfully, but the command is still not recognized until they reopen the terminal. Why?",
    options: [
      "The tool needs a GPU warmup",
      "The terminal session needs to inherit the updated PATH",
      "The registry must be manually deleted first",
      "Node.js waits 10 minutes before loading executables",
    ],
    answer: "The terminal session needs to inherit the updated PATH",
    explanation:
      "Existing terminal sessions keep the environment they inherited at launch. Reopening the terminal refreshes it.",
  },
  {
    type: "scenario",
    track: "debugging-windows-weirdness",
    prompt:
      "A command works in PowerShell but fails in CMD on the same machine. What is the most useful first comparison?",
    options: [
      "Compare PATH and shell environment values",
      "Reinstall the operating system",
      "Delete all local npm packages",
      "Check the screen resolution",
    ],
    answer: "Compare PATH and shell environment values",
    explanation:
      "Differences in shell environment and command resolution are a common cause of inconsistent behavior.",
  },
  {
    type: "scenario",
    track: "developer-experience",
    prompt:
      "A tool fails with 'spawn git ENOENT'. What is the best developer experience improvement?",
    options: [
      "Show only the raw stack trace",
      "Translate the error into a clear message with fix steps",
      "Hide the error completely",
      "Automatically delete the tool cache",
    ],
    answer: "Translate the error into a clear message with fix steps",
    explanation:
      "Actionable errors reduce support burden and help users recover quickly.",
  },
  {
    type: "concept",
    track: "windows-internals",
    prompt: "What does PATH control in CLI environments?",
    options: [
      "Which files are encrypted",
      "Which directories are searched for executables",
      "Which registry hive is mounted",
      "Which user owns a folder",
    ],
    answer: "Which directories are searched for executables",
    explanation:
      "PATH tells the shell or process where to look when you type a command without a full path.",
  },
  {
    type: "concept",
    track: "windows-internals",
    prompt: "What is environment inheritance?",
    options: [
      "A child process receiving environment variables from its parent",
      "A user inheriting registry access from the BIOS",
      "A package manager copying all global npm modules",
      "A shell automatically fixing broken commands",
    ],
    answer: "A child process receiving environment variables from its parent",
    explanation:
      "When a process launches another process, the child inherits a copy of the parent's environment.",
  },
  {
    type: "concept",
    track: "cli-architecture",
    prompt: "What is a subprocess?",
    options: [
      "A hidden registry value",
      "A process started by another process",
      "A file lock inside NTFS",
      "A background network socket",
    ],
    answer: "A process started by another process",
    explanation:
      "Subprocesses are child processes created and managed by a parent process.",
  },
  {
    type: "concept",
    track: "powershell-automation",
    prompt: "What is a key difference between PowerShell cmdlets and native binaries?",
    options: [
      "Cmdlets use objects; native binaries generally use text/string output",
      "Cmdlets only run on Linux",
      "Native binaries cannot accept arguments",
      "There is no practical difference",
    ],
    answer:
      "Cmdlets use objects; native binaries generally use text/string output",
    explanation:
      "PowerShell cmdlets operate on structured objects, while native tools usually behave like traditional text-based CLI programs.",
  },
  {
    type: "concept",
    track: "windows-internals",
    prompt: "What does an ACL define?",
    options: [
      "How quickly a process starts",
      "Which users or groups can access a resource and what they can do",
      "How many arguments a CLI can accept",
      "Which PATH entry loads first",
    ],
    answer:
      "Which users or groups can access a resource and what they can do",
    explanation:
      "ACLs define permissions for users and groups on files, directories, and other resources.",
  },
  {
    type: "concept",
    track: "cli-architecture",
    prompt: "What is the typical config precedence order for CLI tools?",
    options: [
      "Defaults > config file > environment > CLI flags",
      "CLI flags > environment variables > config file > defaults",
      "Environment > defaults > CLI flags > config file",
      "Config file > defaults > registry > shell aliases",
    ],
    answer: "CLI flags > environment variables > config file > defaults",
    explanation:
      "The most explicit user input usually wins, so CLI flags typically override lower-precedence sources.",
  },
  {
    type: "concept",
    track: "powershell-automation",
    prompt: "Why do PowerShell execution policies matter?",
    options: [
      "They control script execution behavior",
      "They replace file permissions",
      "They modify processor scheduling",
      "They define PATH search order",
    ],
    answer: "They control script execution behavior",
    explanation:
      "Execution policies affect whether and how PowerShell scripts are allowed to run.",
  },
  {
    type: "concept",
    track: "cross-platform-compatibility",
    prompt: "Why is the Node.js path module important for cross-platform tools?",
    options: [
      "It automatically installs missing dependencies",
      "It normalizes path handling across operating systems",
      "It replaces the filesystem entirely",
      "It manages TLS certificates",
    ],
    answer: "It normalizes path handling across operating systems",
    explanation:
      "Using the path module helps avoid hardcoded separators and platform-specific path bugs.",
  },
  {
    type: "concept",
    track: "windows-packaging",
    prompt: "What is semantic versioning mainly used for?",
    options: [
      "Communicating the impact of software changes",
      "Managing CPU usage",
      "Replacing package managers",
      "Granting admin privileges",
    ],
    answer: "Communicating the impact of software changes",
    explanation:
      "Semantic versioning tells users whether a release includes breaking changes, new features, or bug fixes.",
  },
  {
    type: "concept",
    track: "windows-packaging",
    prompt: "What is a key difference between Scoop and winget?",
    options: [
      "Scoop installs only Linux packages",
      "Scoop commonly installs per-user, while winget often targets broader Windows package workflows",
      "winget cannot install developer tools",
      "Scoop requires Group Policy",
    ],
    answer:
      "Scoop commonly installs per-user, while winget often targets broader Windows package workflows",
    explanation:
      "Scoop is popular for user-space developer tooling, while winget is Microsoft's broader Windows package manager.",
  },
  {
    type: "concept",
    track: "developer-experience",
    prompt: "What makes an error message actionable?",
    options: [
      "It is very short and vague",
      "It explains the problem and gives the user a useful next step",
      "It hides the problem completely",
      "It only shows internal stack frames",
    ],
    answer:
      "It explains the problem and gives the user a useful next step",
    explanation:
      "Good DX reduces confusion by helping users understand what failed and how to recover.",
  },
  {
    type: "concept",
    track: "debugging-windows-weirdness",
    prompt: "Why is isolating variables important in debugging?",
    options: [
      "It makes the CPU faster",
      "It helps identify the actual cause of failure",
      "It removes the need for logs",
      "It prevents PATH changes",
    ],
    answer: "It helps identify the actual cause of failure",
    explanation:
      "Changing one variable at a time helps you determine which condition actually caused the issue.",
  },
];

function getTrackFromLessonKey(key: string): string {
  if (key.includes("/")) {
    return key.split("/")[0];
  }

  if (key.includes(":")) {
    return key.split(":")[0];
  }

  return key;
}

export function getWeakTracks(progress: RapidProgressMap): Set<string> {
  const weakTracks = new Set<string>();

  for (const key in progress) {
    const item = progress[key];
    const track = getTrackFromLessonKey(key);

    if (!item.completed) {
      weakTracks.add(track);
      continue;
    }

    if (!item.quizPassed) {
      weakTracks.add(track);
      continue;
    }

    if (typeof item.quizScore === "number" && item.quizScore < 80) {
      weakTracks.add(track);
    }
  }

  return weakTracks;
}

export function getQuestionsForMode(
  mode: RapidPracticeMode,
  track: RapidTrack = "all",
  progress?: RapidProgressMap
): RapidQuestion[] {
  if (track === "weak" && progress) {
    const weakTracks = getWeakTracks(progress);

    return rapidQuestions.filter(
      (question) => question.type === mode && weakTracks.has(question.track)
    );
  }

  return rapidQuestions.filter((question) => {
    const matchesMode = question.type === mode;
    const matchesTrack = track === "all" || question.track === track;
    return matchesMode && matchesTrack;
  });
}

export function shuffleQuestions<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}