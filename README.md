# Study Hub

**A structured, interactive learning platform for Windows CLI engineering.**

Built with Next.js 16, TypeScript, React 19, MDX, and Tailwind CSS — and deployed at [study-hub-three-chi.vercel.app](https://study-hub-three-chi.vercel.app).

---

## Why I Built This

I built Study Hub to prepare seriously for engineering work on [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) — Anthropic's AI-powered coding assistant — specifically the challenge of making it work reliably for Windows developers.

Windows developers who use CLI tools like Claude Code run into a consistent class of problems: PATH resolution differences between shells, environment variable inheritance that behaves unexpectedly in subprocesses, execution policy friction with PowerShell, installer quirks with winget and Chocolatey, file locking edge cases, and a general experience gap between Unix-first tooling and Windows. These aren't random bugs — they're the result of deep differences in how Windows manages processes, shells, and environments.

Rather than just reading documentation, I built a platform to actively learn and practice this domain. Study Hub covers 11 tracks of Windows CLI engineering with interactive quizzes, scenario-based debugging drills, and a rapid practice engine — all focused on the real-world problems that affect developer tools on Windows.

---

## What It Covers

| Track | Focus |
|---|---|
| **Windows Internals** | PATH resolution, CMD vs PowerShell, environment inheritance, process model, registry, ACLs |
| **CLI Architecture** | Argument parsing, config precedence, subprocess spawning, terminal I/O |
| **PowerShell Automation** | Execution policies, calling native binaries, pipeline behavior |
| **Windows Packaging** | Chocolatey vs winget, versioning, update strategies, PATH conflicts |
| **Cross-Platform Compatibility** | Shell differences, path separators, newline handling, platform assumptions |
| **Debugging Windows Weirdness** | Diagnosing PATH conflicts, locked files, permission issues, shell inconsistencies |
| **Developer Experience** | Actionable errors, install friction, reducing debugging burden through design |
| **Large Codebase Navigation** | Tracing execution, reading unfamiliar code, contributing without full context |
| **TypeScript + Node CLI** | Building and shipping production CLI tools, frameworks, packaging |
| **AI Tooling + CLI Workflows** | AI-assisted tool invocation patterns, developer intent, safety and control |
| **Certificates and TLS** | X.509 chains, trust stores, SSL debugging in CLI tools |

---

## How It Works

### Content System
Lessons are written in MDX and organized into tracks with structured metadata. Each track is self-contained:

```
content/
  windows-internals/
    meta.ts          ← track title, description, lesson index
    path-resolution.mdx
    cmd-vs-powershell.mdx
    environment-inheritance.mdx
```

Dynamic routing in Next.js maps `/tracks/[track]/[lesson]` to the right MDX file, loaded at build time via `lib/content.ts`.

### Interactive Learning
Each lesson can embed interactive components directly in MDX:

- **`<Quiz />`** — single-question check with immediate feedback and explanation
- **`<QuizSet />`** — multi-question assessment with pass threshold and scoring
- **Rapid Practice** — randomized scenario and concept drills across tracks, with accuracy tracking and streaks

### Progress Tracking
Progress is tracked per lesson — completion state, quiz pass/fail, scores, and timestamps. State is managed via React Context (`ProgressProvider`) and persisted to `localStorage`, with graceful error handling for environments where storage is unavailable.

### Content Scaffolding
New tracks and lessons are generated via CLI scripts:

```bash
npm run new:track -- windows-security
npm run new:lesson -- windows-security credential-manager
npm run scaffold:roadmap   # generates the full track/lesson structure
```

Scripts parse and update `content/track.ts`, generate the `meta.ts` manifest, and scaffold MDX files from templates — keeping structure consistent as the content grows.

---

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS v4 |
| **Content** | MDX via `@next/mdx` |
| **Theming** | `next-themes` (system-aware dark mode) |
| **State** | React Context + localStorage |
| **Deployment** | Vercel |
| **PWA** | Service worker, web manifest, app icons |

---

## Project Structure

```
app/           → Next.js App Router pages and layouts
components/    → UI and interactive learning components
content/       → MDX lessons and track metadata
lib/           → Content loading, progress logic, rapid practice data
scripts/       → Content scaffolding tools
public/        → Static assets and PWA icons
```

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Roadmap

- Confidence-based learning signals
- Adaptive review (surface weak areas automatically)
- Track-level analytics
- Search and filtering
- Authentication + cross-device progress sync
- Windows-specific testing scenarios (sandbox environment)