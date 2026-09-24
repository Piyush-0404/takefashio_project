import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://takefashionproject-yhvw.vercel.app",
]);

function isAllowedOrigin(origin: string) {
  if (allowedOrigins.has(origin)) return true;
  // allow Vercel preview-deployment URLs for this project too
  // (e.g. https://takefashionproject-yhvw-<hash>-<team>.vercel.app)
  return /^https:\/\/takefashionproject-[a-z0-9-]+\.vercel\.app$/.test(origin);
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const response = request.method === "OPTIONS"
    ? new NextResponse(null, { status: 204 })
    : NextResponse.next();

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  }

  return response;
}

export default middleware;

export const config = {
  matcher: "/api/:path*",
};