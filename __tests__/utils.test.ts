import { describe, it, expect } from "vitest";
import { getStreakFromDates } from "@/hooks/useDashboardStats";
import { makeLessonKey } from "@/lib/progress";
import { isValidTrack, trackOrder } from "@/content/track";

// ─── getStreakFromDates ────────────────────────────────────────────────────────

describe("getStreakFromDates", () => {
  function daysAgo(n: number): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  it("returns 0 for an empty array", () => {
    expect(getStreakFromDates([])).toBe(0);
  });

  it("returns 1 for activity only today", () => {
    expect(getStreakFromDates([daysAgo(0)])).toBe(1);
  });

  it("returns 1 for activity only yesterday", () => {
    expect(getStreakFromDates([daysAgo(1)])).toBe(1);
  });

  it("returns 0 for activity two days ago with no recent activity", () => {
    expect(getStreakFromDates([daysAgo(2)])).toBe(0);
  });

  it("counts consecutive days correctly", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2)];
    expect(getStreakFromDates(dates)).toBe(3);
  });

  it("stops at a gap in the streak", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(3)]; // gap on day 2
    expect(getStreakFromDates(dates)).toBe(2);
  });

  it("deduplicates dates (multiple activities on same day)", () => {
    const dates = [daysAgo(0), daysAgo(0), daysAgo(1), daysAgo(1)];
    expect(getStreakFromDates(dates)).toBe(2);
  });

  it("handles a long streak correctly", () => {
    const dates = Array.from({ length: 7 }, (_, i) => daysAgo(i));
    expect(getStreakFromDates(dates)).toBe(7);
  });
});

// ─── makeLessonKey ────────────────────────────────────────────────────────────

describe("makeLessonKey", () => {
  it("formats as track/slug", () => {
    expect(makeLessonKey("windows-internals", "path-resolution")).toBe(
      "windows-internals/path-resolution"
    );
  });

  it("works with any string values", () => {
    expect(makeLessonKey("cli-architecture", "argument-parsing")).toBe(
      "cli-architecture/argument-parsing"
    );
  });
});

// ─── isValidTrack ─────────────────────────────────────────────────────────────

describe("isValidTrack", () => {
  it("returns true for all known track keys", () => {
    trackOrder.forEach((track) => {
      expect(isValidTrack(track)).toBe(true);
    });
  });

  it("returns false for unknown strings", () => {
    expect(isValidTrack("not-a-track")).toBe(false);
    expect(isValidTrack("")).toBe(false);
    expect(isValidTrack("Windows-Internals")).toBe(false); // case sensitive
  });
});

// ─── trackOrder ───────────────────────────────────────────────────────────────

describe("trackOrder", () => {
  it("contains at least one track", () => {
    expect(trackOrder.length).toBeGreaterThan(0);
  });

  it("has no duplicate track keys", () => {
    const unique = new Set(trackOrder);
    expect(unique.size).toBe(trackOrder.length);
  });

  it("starts with windows-internals", () => {
    expect(trackOrder[0]).toBe("windows-internals");
  });
});
