export const trackOrder = [
  "windows-internals",
  "cli-architecture",
  "powershell-automation",
  "windows-packaging",
  "cross-platform-compatibility",
  "debugging-windows-weirdness",
  "developer-experience",
  "large-codebase-navigation",
  "typescript-node-cli",
  "ai-tooling-cli-workflows",
  "certificates-and-tls",
  "anthropic",
  "macos-for-windows-admins",
] as const;

export type TrackKey = (typeof trackOrder)[number];

export function isValidTrack(value: string): value is TrackKey {
  return (trackOrder as readonly string[]).includes(value);
}
