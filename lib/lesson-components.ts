import type { ComponentType } from "react";

import m0 from "@/content/ai-tooling-cli-workflows/ai-assisted-cli-workflows.mdx";
import m1 from "@/content/ai-tooling-cli-workflows/ai-tool-invocation-patterns.mdx";
import m2 from "@/content/ai-tooling-cli-workflows/context-management.mdx";
import m3 from "@/content/ai-tooling-cli-workflows/how-claude-code-works.mdx";
import m4 from "@/content/anthropic/anthropic-culture.mdx";
import m5 from "@/content/anthropic/anthropic-mission.mdx";
import m6 from "@/content/anthropic/interview-process.mdx";
import m7 from "@/content/certificates-and-tls/tls-debugging.mdx";
import m8 from "@/content/certificates-and-tls/x509-basics.mdx";
import m9 from "@/content/cli-architecture/cli-argument-parsing.mdx";
import m10 from "@/content/cli-architecture/config-precedence.mdx";
import m11 from "@/content/cli-architecture/subprocess-spawning.mdx";
import m12 from "@/content/cli-architecture/terminal-io.mdx";
import m13 from "@/content/cross-platform-compatibility/cross-platform-differences.mdx";
import m14 from "@/content/cross-platform-compatibility/file-path-differences.mdx";
import m15 from "@/content/cross-platform-compatibility/newline-differences.mdx";
import m16 from "@/content/debugging-windows-weirdness/debugging-platform-issues.mdx";
import m17 from "@/content/debugging-windows-weirdness/locked-files.mdx";
import m18 from "@/content/debugging-windows-weirdness/path-conflicts.mdx";
import m19 from "@/content/developer-experience/actionable-errors.mdx";
import m20 from "@/content/developer-experience/install-friction.mdx";
import m21 from "@/content/large-codebase-navigation/navigating-large-codebases.mdx";
import m22 from "@/content/large-codebase-navigation/reading-unfamiliar-code.mdx";
import m23 from "@/content/large-codebase-navigation/tracing-execution-flow.mdx";
import m24 from "@/content/powershell-automation/calling-native-binaries.mdx";
import m25 from "@/content/powershell-automation/execution-policies.mdx";
import m26 from "@/content/powershell-automation/execution-policy.mdx";
import m27 from "@/content/powershell-automation/powershell-pipeline-behavior.mdx";
import m28 from "@/content/typescript-node-cli/building-a-cli.mdx";
import m29 from "@/content/typescript-node-cli/bun-vs-node.mdx";
import m30 from "@/content/typescript-node-cli/cli-frameworks.mdx";
import m31 from "@/content/typescript-node-cli/commander-internals.mdx";
import m32 from "@/content/typescript-node-cli/packaging-and-distribution.mdx";
import m33 from "@/content/windows-internals/acls-and-permissions.mdx";
import m34 from "@/content/windows-internals/cmd-vs-powershell.mdx";
import m35 from "@/content/windows-internals/environment-inheritance.mdx";
import m36 from "@/content/windows-internals/path-resolution.mdx";
import m37 from "@/content/windows-internals/process-model-overview.mdx";
import m38 from "@/content/windows-internals/registry-basics.mdx";
import m39 from "@/content/windows-packaging/chocolatey-vs-winget.mdx";
import m40 from "@/content/windows-packaging/versioning-and-updates.mdx";
import m41 from "@/content/windows-packaging/winget-basics.mdx";

export const lessonComponentMap = {
  "ai-tooling-cli-workflows/ai-assisted-cli-workflows": m0,
  "ai-tooling-cli-workflows/ai-tool-invocation-patterns": m1,
  "ai-tooling-cli-workflows/context-management": m2,
  "ai-tooling-cli-workflows/how-claude-code-works": m3,
  "anthropic/anthropic-culture": m4,
  "anthropic/anthropic-mission": m5,
  "anthropic/interview-process": m6,
  "certificates-and-tls/tls-debugging": m7,
  "certificates-and-tls/x509-basics": m8,
  "cli-architecture/cli-argument-parsing": m9,
  "cli-architecture/config-precedence": m10,
  "cli-architecture/subprocess-spawning": m11,
  "cli-architecture/terminal-io": m12,
  "cross-platform-compatibility/cross-platform-differences": m13,
  "cross-platform-compatibility/file-path-differences": m14,
  "cross-platform-compatibility/newline-differences": m15,
  "debugging-windows-weirdness/debugging-platform-issues": m16,
  "debugging-windows-weirdness/locked-files": m17,
  "debugging-windows-weirdness/path-conflicts": m18,
  "developer-experience/actionable-errors": m19,
  "developer-experience/install-friction": m20,
  "large-codebase-navigation/navigating-large-codebases": m21,
  "large-codebase-navigation/reading-unfamiliar-code": m22,
  "large-codebase-navigation/tracing-execution-flow": m23,
  "powershell-automation/calling-native-binaries": m24,
  "powershell-automation/execution-policies": m25,
  "powershell-automation/execution-policy": m26,
  "powershell-automation/powershell-pipeline-behavior": m27,
  "typescript-node-cli/building-a-cli": m28,
  "typescript-node-cli/bun-vs-node": m29,
  "typescript-node-cli/cli-frameworks": m30,
  "typescript-node-cli/commander-internals": m31,
  "typescript-node-cli/packaging-and-distribution": m32,
  "windows-internals/acls-and-permissions": m33,
  "windows-internals/cmd-vs-powershell": m34,
  "windows-internals/environment-inheritance": m35,
  "windows-internals/path-resolution": m36,
  "windows-internals/process-model-overview": m37,
  "windows-internals/registry-basics": m38,
  "windows-packaging/chocolatey-vs-winget": m39,
  "windows-packaging/versioning-and-updates": m40,
  "windows-packaging/winget-basics": m41,
} as const;

export function getLessonComponent(
  track: string,
  slug: string
): ComponentType | null {
  return lessonComponentMap[
    `${track}/${slug}` as keyof typeof lessonComponentMap
  ] ?? null;
}