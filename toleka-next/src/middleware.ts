import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName, verifySession } from "@/lib/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/api/health",
  "/api/loadboard",
  "/api/hubspot/webhook",
  "/api/hubspot/status",
  "/api/hubspot/sync/cron",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals/static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Allow auth endpoints
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Protect app routes + private APIs
  const token = req.cookies.get(sessionCookieName())?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Login required" } },
        { status: 401 },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};

