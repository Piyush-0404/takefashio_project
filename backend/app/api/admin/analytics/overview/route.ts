import { getAdminOrResponse } from "@/lib/admin";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { getAnalyticsOverview, parseAnalyticsRange } from "@/lib/analytics";

export async function GET(request: Request) {
  const admin = await getAdminOrResponse();
  if (admin instanceof Response) return admin;
  try { return ok(await getAnalyticsOverview(parseAnalyticsRange(new URL(request.url).searchParams))); }
  catch (error) { if (error instanceof Error && error.message === "INVALID_ANALYTICS_RANGE") return badRequest("Invalid analytics date range", 400); if (error instanceof Error && error.message === "ANALYTICS_RANGE_TOO_LARGE") return badRequest("Analytics range cannot exceed one year", 400); return errorResponse(error); }
}