import { NextRequest, NextResponse } from "next/server";
import {
  OWNER_SESSION_COOKIE,
  verifyOwnerSessionToken,
} from "@/lib/owner-session-token";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(OWNER_SESSION_COOKIE)?.value;
  if (verifyOwnerSessionToken(sessionToken)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/admin-panel/:path*"],
};
