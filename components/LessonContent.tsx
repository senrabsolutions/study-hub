"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

type LessonContentProps = {
  track: string;
  lesson: string;
};

const lessonMap = {
  "windows-internals/path-resolution": dynamic(
    () => import("@/content/windows-internals/path-resolution.mdx")
  ),
  "windows-internals/cmd-vs-powershell": dynamic(
    () => import("@/content/windows-internals/cmd-vs-powershell.mdx")
  ),
  "windows-internals/environment-inheritance": dynamic(
    () => import("@/content/windows-internals/environment-inheritance.mdx")
  ),
  "windows-internals/process-model-overview": dynamic(
    () => import("@/content/windows-internals/process-model-overview.mdx")
  ),
  "windows-internals/registry-basics": dynamic(
    () => import("@/content/windows-internals/registry-basics.mdx")
  ),
  "windows-internals/acls-and-permissions": dynamic(
    () => import("@/content/windows-internals/acls-and-permissions.mdx")
  ),

  "cli-architecture/cli-argument-parsing": dynamic(
    () => import("@/content/cli-architecture/cli-argument-parsing.mdx")
  ),
  "cli-architecture/config-precedence": dynamic(
    () => import("@/content/cli-architecture/config-precedence.mdx")
  ),
  "cli-architecture/subprocess-spawning": dynamic(
    () => import("@/content/cli-architecture/subprocess-spawning.mdx")
  ),
  "cli-architecture/terminal-io": dynamic(
    () => import("@/content/cli-architecture/terminal-io.mdx")
  ),

  "powershell-automation/calling-native-binaries": dynamic(
    () => import("@/content/powershell-automation/calling-native-binaries.mdx")
  ),
  "powershell-automation/execution-policies": dynamic(
    () => import("@/content/powershell-automation/execution-policies.mdx")
  ),
  "powershell-automation/execution-policy": dynamic(
    () => import("@/content/powershell-automation/execution-policy.mdx")
  ),
  "powershell-automation/powershell-pipeline-behavior": dynamic(
    () =>
      import("@/content/powershell-automation/powershell-pipeline-behavior.mdx")
  ),

  "windows-packaging/winget-basics": dynamic(
    () => import("@/content/windows-packaging/winget-basics.mdx")
  ),
  "windows-packaging/chocolatey-vs-winget": dynamic(
    () => import("@/content/windows-packaging/chocolatey-vs-winget.mdx")
  ),
  "windows-packaging/versioning-and-updates": dynamic(
    () => import("@/content/windows-packaging/versioning-and-updates.mdx")
  ),

  "cross-platform-compatibility/file-path-differences": dynamic(
    () => import("@/content/cross-platform-compatibility/file-path-differences.mdx")
  ),
  "cross-platform-compatibility/cross-platform-differences": dynamic(
    () =>
      import("@/content/cross-platform-compatibility/cross-platform-differences.mdx")
  ),
  "cross-platform-compatibility/newline-differences": dynamic(
    () => import("@/content/cross-platform-compatibility/newline-differences.mdx")
  ),

  "debugging-windows-weirdness/path-conflicts": dynamic(
    () => import("@/content/debugging-windows-weirdness/path-conflicts.mdx")
  ),
  "debugging-windows-weirdness/locked-files": dynamic(
    () => import("@/content/debugging-windows-weirdness/locked-files.mdx")
  ),
  "debugging-windows-weirdness/debugging-platform-issues": dynamic(
    () =>
      import("@/content/debugging-windows-weirdness/debugging-platform-issues.mdx")
  ),

  "developer-experience/actionable-errors": dynamic(
    () => import("@/content/developer-experience/actionable-errors.mdx")
  ),
  "developer-experience/install-friction": dynamic(
    () => import("@/content/developer-experience/install-friction.mdx")
  ),

  "large-codebase-navigation/reading-unfamiliar-code": dynamic(
    () => import("@/content/large-codebase-navigation/reading-unfamiliar-code.mdx")
  ),
  "large-codebase-navigation/navigating-large-codebases": dynamic(
    () =>
      import("@/content/large-codebase-navigation/navigating-large-codebases.mdx")
  ),
  "large-codebase-navigation/tracing-execution-flow": dynamic(
    () => import("@/content/large-codebase-navigation/tracing-execution-flow.mdx")
  ),

  "typescript-node-cli/building-a-cli": dynamic(
    () => import("@/content/typescript-node-cli/building-a-cli.mdx")
  ),
  "typescript-node-cli/bun-vs-node": dynamic(
    () => import("@/content/typescript-node-cli/bun-vs-node.mdx")
  ),
  "typescript-node-cli/cli-frameworks": dynamic(
    () => import("@/content/typescript-node-cli/cli-frameworks.mdx")
  ),
  "typescript-node-cli/commander-internals": dynamic(
    () => import("@/content/typescript-node-cli/commander-internals.mdx")
  ),
  "typescript-node-cli/packaging-and-distribution": dynamic(
    () => import("@/content/typescript-node-cli/packaging-and-distribution.mdx")
  ),

  "ai-tooling-cli-workflows/ai-assisted-cli-workflows": dynamic(
    () => import("@/content/ai-tooling-cli-workflows/ai-assisted-cli-workflows.mdx")
  ),
  "ai-tooling-cli-workflows/ai-tool-invocation-patterns": dynamic(
    () =>
      import("@/content/ai-tooling-cli-workflows/ai-tool-invocation-patterns.mdx")
  ),
  "ai-tooling-cli-workflows/context-management": dynamic(
    () => import("@/content/ai-tooling-cli-workflows/context-management.mdx")
  ),
  "ai-tooling-cli-workflows/how-claude-code-works": dynamic(
    () => import("@/content/ai-tooling-cli-workflows/how-claude-code-works.mdx")
  ),

  "certificates-and-tls/x509-basics": dynamic(
    () => import("@/content/certificates-and-tls/x509-basics.mdx")
  ),
  "certificates-and-tls/tls-debugging": dynamic(
    () => import("@/content/certificates-and-tls/tls-debugging.mdx")
  ),

  "anthropic/anthropic-mission": dynamic(
    () => import("@/content/anthropic/anthropic-mission.mdx")
  ),
  "anthropic/anthropic-culture": dynamic(
    () => import("@/content/anthropic/anthropic-culture.mdx")
  ),
  "anthropic/interview-process": dynamic(
    () => import("@/content/anthropic/interview-process.mdx")
  ),
} as const;

export default function LessonContent({
  track,
  lesson,
}: LessonContentProps) {
  const key = `${track}/${lesson}` as keyof typeof lessonMap;
  const Lesson = lessonMap[key];

  if (!Lesson) {
    notFound();
  }

  return <Lesson />;
}