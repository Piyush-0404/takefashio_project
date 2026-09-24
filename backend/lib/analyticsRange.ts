export type AnalyticsRange = { from: Date; to: Date };

export function parseAnalyticsRange(searchParams: URLSearchParams): AnalyticsRange {
  const now = new Date();
  const to = searchParams.get("to") ? new Date(searchParams.get("to") as string) : now;
  const fromValue = searchParams.get("from");
  const preset = searchParams.get("preset");
  let from = fromValue ? new Date(fromValue) : new Date(now);
  if (!fromValue) {
    if (preset === "today") from.setHours(0, 0, 0, 0);
    else if (preset === "7d") from.setDate(from.getDate() - 6);
    else if (preset === "30d") from.setDate(from.getDate() - 29);
    else if (preset === "month") from = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (preset === "previous-month") return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999) };
    else from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  }
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) throw new Error("INVALID_ANALYTICS_RANGE");
  if (to.getTime() - from.getTime() > 366 * 24 * 60 * 60 * 1000) throw new Error("ANALYTICS_RANGE_TOO_LARGE");
  return { from, to };
}