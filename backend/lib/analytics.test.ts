import { describe, expect, it } from "vitest";
import { parseAnalyticsRange } from "./analyticsRange";

describe("analytics date ranges", () => {
  it("creates a bounded 7-day range", () => {
    const range = parseAnalyticsRange(new URLSearchParams("preset=7d"));
    expect(range.from.getHours()).toBe(0);
    expect(range.to.getTime()).toBeGreaterThan(range.from.getTime());
    expect(range.to.getTime() - range.from.getTime()).toBeLessThan(8 * 24 * 60 * 60 * 1000);
  });

  it("rejects invalid and oversized custom ranges", () => {
    expect(() => parseAnalyticsRange(new URLSearchParams("from=invalid"))).toThrow("INVALID_ANALYTICS_RANGE");
    expect(() => parseAnalyticsRange(new URLSearchParams("from=2020-01-01&to=2026-01-01"))).toThrow("ANALYTICS_RANGE_TOO_LARGE");
  });
});