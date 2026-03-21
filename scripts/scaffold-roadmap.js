const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const contentRoot = path.join(projectRoot, "content");
const trackFilePath = path.join(contentRoot, "track.ts");

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function escapeForTs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseTrackOrder(trackFileContent) {
  const match = trackFileContent.match(
    /export\s+const\s+trackOrder\s*=\s*\[([\s\S]*?)\]\s+as\s+const/
  );

  if (!match) {
    throw new Error(
      "Could not parse trackOrder from content/track.ts. Check the file format."
    );
  }

  const items = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  if (items.length === 0) {
    throw new Error("No tracks found in content/track.ts.");
  }

  return items;
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => {
      const lower = part.toLowerCase();

      if (lower === "cmd") return "CMD";
      if (lower === "powershell") return "PowerShell";
      if (lower === "cli") return "CLI";
      if (lower === "api") return "API";
      if (lower === "ntfs") return "NTFS";
      if (lower === "acl") return "ACL";
      if (lower === "ai") return "AI";
      if (lower === "tls") return "TLS";
      if (lower === "x509" || lower === "x.509") return "X.509";
      if (lower === "vs") return "VS";

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function trackTitleFromSlug(track) {
  return track
    .split("-")
    .map((part) => {
      const lower = part.toLowerCase();

      if (lower === "cli") return "CLI";
      if (lower === "ai") return "AI";
      if (lower === "tls") return "TLS";

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function codeBlock(content) {
  return `<pre className="rounded-xl border border-gray-200 bg-gray-100 p-4 text-sm overflow-x-auto dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
  <code>
{\`${content}\`}
  </code>
</pre>`;
}

function getStarterLesson(track) {
  const map = {
    "windows-internals": {
      slug: "path-resolution",
      title: "PATH Resolution on Windows",
      summary:
        "Learn how Windows finds executables using PATH, PATHEXT, and inherited environment variables across shells and process contexts.",
      body: `# PATH Resolution on Windows

## Why this matters

CLI tools frequently fail on Windows because command resolution behaves differently across shells, users, and process contexts. If you do not understand how PATH works, you can end up debugging the wrong problem.

## Key Concepts

- System PATH vs User PATH
- PATHEXT and executable discovery
- Environment inheritance from parent processes
- Differences in command lookup between CMD and PowerShell

## Quick Summary

PATH helps Windows decide where to look for executables when you type a command without a full file path. Failures often come from missing directories, conflicting versions of the same tool, shell-specific behavior, or stale environment variables.

## Quick Lab

### Run in CMD

${codeBlock(`echo %PATH%
where node`)}

### Run in PowerShell

${codeBlock(`$env:PATH
Get-Command node`)}

## What to Notice

- The PATH contents may appear differently depending on the shell
- CMD uses \`where\` for command lookup
- PowerShell uses \`Get-Command\`, which can resolve aliases, functions, scripts, and executables
- A tool may exist on disk but still fail if its directory is not in PATH

## Interview Angle

Be ready to explain why a CLI tool might work in one shell but fail in another. A strong answer should mention PATH, PATHEXT, environment inheritance, and the broader command resolution behavior in PowerShell.
`,
    },

    "cli-architecture": {
      slug: "argument-parsing",
      title: "Argument Parsing",
      summary:
        "Understand how CLI tools interpret flags, subcommands, and positional arguments across platforms.",
      body: `# Argument Parsing

## Why this matters

A CLI tool is only as usable as its command interface. If users cannot predict how commands, flags, and arguments behave, the tool becomes frustrating and error-prone.

## Key Concepts

- Positional arguments
- Optional flags
- Subcommands
- Help output and usage patterns

## Quick Summary

Argument parsing determines how a command-line tool interprets user input. Good parsing design improves usability, reduces ambiguity, and makes debugging much easier.

## Quick Lab

### Example Inputs

${codeBlock(`mytool init project-name
mytool deploy --env prod
mytool config set timeout 30`)}

## What to Notice

- Positional arguments often represent required input
- Flags modify behavior without changing the core command
- Subcommands help organize complex tools into predictable patterns

## Interview Angle

Be ready to explain how you would design a CLI interface that is easy to learn, difficult to misuse, and consistent across commands.
`,
    },

    "powershell-automation": {
      slug: "execution-policy",
      title: "Execution Policy",
      summary:
        "Learn how PowerShell execution policies affect script behavior, automation, and troubleshooting on Windows.",
      body: `# Execution Policy

## Why this matters

PowerShell execution policy is one of the first things that can block automation on Windows. If you do not understand it, scripts may fail before your logic even runs.

## Key Concepts

- Restricted vs RemoteSigned vs Bypass
- Scope differences
- Script blocking behavior
- Operational troubleshooting

## Quick Summary

Execution policy helps control how PowerShell scripts are allowed to run. It is not a security boundary, but it often affects installation scripts, setup tasks, and automation workflows.

## Quick Lab

### In PowerShell

${codeBlock(`Get-ExecutionPolicy
Get-ExecutionPolicy -List`)}

## What to Notice

- Execution policy can differ by scope
- A script may fail because of policy, not because of script logic
- Troubleshooting starts with identifying which scope is taking effect

## Interview Angle

Be ready to explain what execution policy does, what it does not do, and how you would troubleshoot script execution failures in a Windows environment.
`,
    },

    "windows-packaging": {
      slug: "winget-basics",
      title: "winget Basics",
      summary:
        "Understand the basics of Windows package installation, versioning, and distribution using winget.",
      body: `# winget Basics

## Why this matters

If you want users to install your CLI tool easily on Windows, package management matters. A great developer experience starts with reliable installation.

## Key Concepts

- Package manifests
- Versioned installs
- Upgrade flows
- User expectations for install paths

## Quick Summary

winget is Microsoft's package manager for Windows. It helps users install, upgrade, and manage software using consistent command-line workflows.

## Quick Lab

### In PowerShell

${codeBlock(`winget search git
winget show Microsoft.PowerShell`)}

## What to Notice

- Package managers make installation repeatable
- Metadata matters for discoverability
- Users expect update and uninstall flows to work cleanly

## Interview Angle

Be ready to explain how you would distribute a CLI tool to Windows users and why package-manager support improves adoption and supportability.
`,
    },

    "cross-platform-compatibility": {
      slug: "file-path-differences",
      title: "File Path Differences",
      summary:
        "Compare path syntax, separators, and path-handling pitfalls between Windows, Linux, and macOS.",
      body: `# File Path Differences

## Why this matters

Cross-platform CLI tools often fail on path handling before anything else. Windows, Linux, and macOS all have different expectations around separators, casing, and path behavior.

## Key Concepts

- Backslashes vs forward slashes
- Relative vs absolute paths
- Case sensitivity differences
- Home directory assumptions

## Quick Summary

Path handling is one of the biggest sources of cross-platform bugs. Reliable tooling avoids hardcoded assumptions and uses platform-aware path utilities.

## Quick Lab

### Compare Examples

${codeBlock(`Windows: C:\\Tools\\myapp\\config.json
Linux:   /usr/local/bin/myapp
macOS:   /Users/example/.config/myapp`)}

## What to Notice

- Windows paths often include drive letters
- Separator expectations differ
- Case sensitivity may differ between platforms

## Interview Angle

Be ready to explain why path bugs happen when porting tools between Linux and Windows and how you would design around them.
`,
    },

    "debugging-windows-weirdness": {
      slug: "path-conflicts",
      title: "PATH Conflicts",
      summary:
        "Learn how conflicting PATH entries and duplicate tools create hard-to-diagnose Windows CLI issues.",
      body: `# PATH Conflicts

## Why this matters

When a command works on one machine but not another, PATH conflicts are often the reason. Multiple versions of the same tool can create confusing behavior.

## Key Concepts

- Duplicate executables
- PATH ordering
- Shadowed commands
- User vs system PATH conflicts

## Quick Summary

PATH conflicts happen when Windows finds a different executable than the one you expected. Debugging these issues requires checking resolution order and installed versions.

## Quick Lab

### In CMD

${codeBlock(`where python
where node`)}

### In PowerShell

${codeBlock(`Get-Command python
Get-Command node`)}

## What to Notice

- The same command name can resolve to multiple locations
- Resolution order matters
- Different shells may show different information

## Interview Angle

Be ready to explain how you would debug a tool that works for some Windows users but fails for others.
`,
    },

    "developer-experience": {
      slug: "install-friction",
      title: "Install Friction",
      summary:
        "Study how installation complexity affects adoption, support burden, and perceived quality of developer tools.",
      body: `# Install Friction

## Why this matters

A tool that is hard to install is a tool people will avoid. Good developer experience begins before the first command ever runs.

## Key Concepts

- Time to first success
- Clear installation steps
- Good defaults
- Actionable setup documentation

## Quick Summary

Install friction is any barrier that prevents a user from getting started quickly. Reducing friction improves adoption and lowers support costs.

## Quick Lab

### Think Through the Flow

${codeBlock(`Install the tool
Verify it is on PATH
Run the help command
Complete a first successful task`)}

## What to Notice

- Every extra install step increases failure risk
- Verification steps reduce confusion
- Documentation should help users confirm success quickly

## Interview Angle

Be ready to explain what makes a developer tool feel polished and what signals a poor installation experience.
`,
    },

    "large-codebase-navigation": {
      slug: "reading-unfamiliar-code",
      title: "Reading Unfamiliar Code",
      summary:
        "Build a method for exploring large repositories, tracing execution flow, and contributing safely.",
      body: `# Reading Unfamiliar Code

## Why this matters

Large codebases are intimidating until you develop a system for navigating them. Engineers who can orient themselves quickly become effective much faster.

## Key Concepts

- Entry points
- Dependency flow
- Search strategies
- Small-scope debugging

## Quick Summary

Reading unfamiliar code is about building a map. You start with the entry point, identify important modules, and trace behavior in manageable steps.

## Quick Lab

### First-Pass Questions

${codeBlock(`Where does execution start?
Where are commands defined?
How is configuration loaded?
Where are errors logged?`)}

## What to Notice

- Large systems become manageable when broken into flows
- Search and tracing matter more than memorization
- Good debugging starts with identifying the right boundary

## Interview Angle

Be ready to explain how you approach a new repository and how you reduce risk while making your first changes.
`,
    },

    "typescript-node-cli": {
      slug: "building-a-cli",
      title: "Building a CLI",
      summary:
        "Learn the basic structure of a Node.js and TypeScript command-line application.",
      body: `# Building a CLI

## Why this matters

Many modern developer tools are built with Node.js and TypeScript. Understanding the structure of a CLI helps you reason about command registration, configuration, and packaging.

## Key Concepts

- Entry points
- Argument parsing libraries
- Type safety
- Package scripts and execution flow

## Quick Summary

A Node-based CLI usually has an entry file, command parsing logic, configuration handling, and output behavior. TypeScript helps make the code safer and easier to maintain.

## Quick Lab

### Example Flow

${codeBlock(`Parse arguments
Validate input
Run command logic
Return exit code`)}

## What to Notice

- CLIs still benefit from good architecture
- Entry-point clarity matters
- Typed command flows improve maintainability

## Interview Angle

Be ready to explain how you would structure a small CLI in Node and TypeScript and what tradeoffs you would consider.
`,
    },

    "ai-tooling-cli-workflows": {
      slug: "ai-assisted-cli-workflows",
      title: "AI-Assisted CLI Workflows",
      summary:
        "Explore how AI tools can support terminal-based development workflows without replacing engineering judgment.",
      body: `# AI-Assisted CLI Workflows

## Why this matters

AI tools are increasingly part of modern developer workflows. Understanding where they help and where they introduce risk is important for safe and productive tooling.

## Key Concepts

- Prompt-driven workflows
- Validation and verification
- Tool boundaries
- Human review

## Quick Summary

AI can help with command generation, debugging ideas, and automation planning, but it must be paired with verification and clear safety boundaries.

## Quick Lab

### Reflect on Use Cases

${codeBlock(`Generate a command
Validate the command
Run it in a safe context
Review the result`)}

## What to Notice

- AI output still requires verification
- CLI workflows benefit from reproducibility and review
- Good tooling keeps the human in control

## Interview Angle

Be ready to explain how AI can improve a CLI workflow and what guardrails you would put in place to keep it safe and useful.
`,
    },
  };

  return map[track];
}

function makePlaceholderMeta(track) {
  return `export const trackMeta = {
  title: "${escapeForTs(trackTitleFromSlug(track))}",
  description:
    "Describe what this track teaches and how it supports Windows CLI engineering.",
} as const;

export const lessons = [] as const;
`;
}

function makeMetaWithStarter(track, starter) {
  return `export const trackMeta = {
  title: "${escapeForTs(trackTitleFromSlug(track))}",
  description:
    "Describe what this track teaches and how it supports Windows CLI engineering.",
} as const;

export const lessons = [
  {
    slug: "${escapeForTs(starter.slug)}",
    title: "${escapeForTs(starter.title)}",
    order: 1,
    summary:
      "${escapeForTs(starter.summary)}",
    duration: "10 min",
    difficulty: "Beginner",
  },
] as const;
`;
}

function insertLessonIntoMeta(metaContent, starter) {
  if (!metaContent.includes("export const lessons")) {
    return metaContent;
  }

  const alreadyHasLesson = metaContent.includes(`slug: "${starter.slug}"`);
  if (alreadyHasLesson) {
    return metaContent;
  }

  const emptyArrayPattern = /export const lessons = \[\] as const;/;

  if (emptyArrayPattern.test(metaContent)) {
    return metaContent.replace(
      emptyArrayPattern,
      `export const lessons = [
  {
    slug: "${escapeForTs(starter.slug)}",
    title: "${escapeForTs(starter.title)}",
    order: 1,
    summary:
      "${escapeForTs(starter.summary)}",
    duration: "10 min",
    difficulty: "Beginner",
  },
] as const;`
    );
  }

  return metaContent;
}

function main() {
  const trackFileContent = readFileSafe(trackFilePath);

  if (!trackFileContent) {
    throw new Error("Missing content/track.ts");
  }

  const tracks = parseTrackOrder(trackFileContent);

  console.log(`Found ${tracks.length} tracks.`);

  tracks.forEach((track) => {
    const trackDir = path.join(contentRoot, track);
    const metaPath = path.join(trackDir, "meta.ts");

    fs.mkdirSync(trackDir, { recursive: true });

    const starter = getStarterLesson(track);
    const existingMeta = readFileSafe(metaPath);

    if (!existingMeta) {
      if (starter) {
        writeFileSafe(metaPath, makeMetaWithStarter(track, starter));
        console.log(`Created meta.ts with starter lesson for ${track}`);
      } else {
        writeFileSafe(metaPath, makePlaceholderMeta(track));
        console.log(`Created placeholder meta.ts for ${track}`);
      }
    } else if (starter) {
      const updatedMeta = insertLessonIntoMeta(existingMeta, starter);
      if (updatedMeta !== existingMeta) {
        writeFileSafe(metaPath, updatedMeta);
        console.log(`Updated meta.ts with starter lesson for ${track}`);
      }
    }

    if (starter) {
      const lessonPath = path.join(trackDir, `${starter.slug}.mdx`);
      if (!fs.existsSync(lessonPath)) {
        writeFileSafe(lessonPath, starter.body);
        console.log(`Created starter lesson ${track}/${starter.slug}.mdx`);
      }
    }
  });

  console.log("Roadmap scaffold complete.");
}

main();