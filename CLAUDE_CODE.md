# Why I Built This — Claude Code on Windows

This platform exists because I want to work on [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) — specifically the Windows engineering role. Every track in this platform maps directly to a real problem that Windows developers encounter when using CLI tools like Claude Code.

This document explains the connection.

---

## Windows Internals → PATH and environment failures

Claude Code is installed as a global npm package. On Windows, that means it lands in `%APPDATA%\npm` and depends on that directory being on PATH. It also means every subprocess Claude Code spawns — git, node, language servers, build tools — inherits the environment of the shell that launched it.

When Claude Code "can't find git" or "can't find node" for a user who definitely has those installed, the answer is almost always in Windows Internals: PATH resolution, environment inheritance, or a stale shell session that hasn't picked up a new install.

**Tracks:** Windows Internals, Debugging Windows Weirdness

---

## PowerShell Automation → The .ps1 wrapper problem

npm creates a `claude.ps1` wrapper so Claude Code works in PowerShell. But if the user's execution policy is `Restricted` — which is the default on many Windows machines — that wrapper won't run. The user gets a confusing error that has nothing to do with Claude Code itself.

PowerShell is also where Windows developers write automation that calls Claude Code. Understanding how PowerShell handles argument passing, native binary calls, and pipeline behavior is essential for ensuring Claude Code works correctly as part of scripted workflows.

**Track:** PowerShell Automation

---

## Windows Packaging → Installation reliability

Claude Code needs to be installable via `npm install -g`, and ideally via winget and Chocolatey for enterprise environments. Each of these creates different PATH behaviors, different permission contexts, and different update semantics.

The Windows Packaging track covers exactly what happens when a global npm install succeeds but the tool still isn't found — and how to design installation to fail clearly instead of silently.

**Track:** Windows Packaging

---

## CLI Architecture → Subprocess execution and shell spawning

Claude Code spawns subprocesses constantly — running user commands, invoking tools, executing code. On Windows, subprocess behavior is more complex than on Unix: shell selection matters, argument quoting differs, and `cmd.exe` vs PowerShell vs Git Bash all handle things differently.

Understanding how Node.js spawns child processes on Windows — which shell it uses by default, how it passes arguments, how it handles stdout/stderr — is foundational to diagnosing the class of bugs that only appear on Windows.

**Track:** CLI Architecture

---

## Cross-Platform Compatibility → Making Unix-first code work on Windows

Claude Code was built by engineers who primarily use macOS and Linux. Path separators, line endings, shell assumptions, and filesystem behavior all differ on Windows in ways that are easy to overlook.

This track covers the specific differences that matter most for CLI tools — the ones that cause code to work perfectly on macOS and fail silently or cryptically on Windows.

**Track:** Cross-Platform Compatibility

---

## Developer Experience → First impressions and error design

The install experience and error messages are the first things a Windows developer encounters. A confusing error at install time, or a cryptic failure message during use, shapes whether someone trusts the tool.

This track covers what good DX looks like for Windows users specifically — actionable errors, clean installation, and reducing the gap between "something went wrong" and "here's how to fix it."

**Tracks:** Developer Experience, Install Friction

---

## TypeScript + Node CLI → Understanding the codebase itself

Claude Code is a TypeScript CLI built on Node.js. Working in the codebase means understanding how the tool is structured, how commands are parsed, how it's packaged and distributed, and how TypeScript compiles to something npm can wrap and execute on Windows.

This track covers that foundation — from entry points and bin wrappers to CLI frameworks and distribution.

**Track:** TypeScript + Node CLI

---

## Certificates and TLS → Enterprise Windows environments

Enterprise Windows users often work behind TLS-intercepting proxies. Claude Code makes HTTPS requests to Anthropic's API. In a corporate environment, those requests go through a proxy that re-signs them with a corporate CA that Node.js doesn't trust by default.

This causes mysterious SSL errors that have nothing to do with Claude Code's code — but everything to do with how Node.js handles certificate trust on Windows. Understanding this is essential for supporting enterprise users.

**Track:** Certificates and TLS

---

## Debugging Windows Weirdness → Everything else

Some Windows issues don't fit neatly into a single category. File locking, permission inheritance, long path limits, case-insensitive filesystem behavior, registry interactions — these come up in unexpected places and require a systematic debugging approach.

This track is about building the diagnostic instincts to work through Windows-specific failures methodically.

**Track:** Debugging Windows Weirdness

---

## Large Codebase Navigation → Ramping on Claude Code itself

Claude Code is a large, active codebase. Contributing effectively means being able to trace execution flow, understand how unfamiliar modules fit together, and make changes safely without full context.

This track covers the practical skills for navigating and contributing to a codebase you didn't write — which is the reality of joining any established engineering team.

**Track:** Large Codebase Navigation

---

*Built by Logan Barnes — [linkedin.com/in/logan-barnes-65563a180](https://linkedin.com/in/logan-barnes-65563a180)*
