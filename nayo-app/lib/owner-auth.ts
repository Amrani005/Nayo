import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  OWNER_SESSION_COOKIE,
  verifyOwnerSessionToken,
} from "@/lib/owner-session-token";

export async function requireOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_SESSION_COOKIE)?.value;

  if (!verifyOwnerSessionToken(token)) {
    redirect("/login");
  }
}
