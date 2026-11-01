"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createOwnerSessionToken,
  OWNER_SESSION_COOKIE,
  OWNER_SESSION_MAX_AGE,
} from "@/lib/owner-session-token";

export type LoginState = { error?: string } | null;

function passwordMatches(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function loginOwner(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  const authSecret = process.env.AUTH_SECRET;

  if (!ownerEmail || !ownerPassword || !authSecret || authSecret.length < 32) {
    return {
      error:
        "تسجيل الدخول غير مهيأ  ",
    };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim().toLowerCase() !== ownerEmail ||
    !passwordMatches(password, ownerPassword)
  ) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  const cookieStore = await cookies();
  
  cookieStore.set(
    OWNER_SESSION_COOKIE,
    createOwnerSessionToken(ownerEmail),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OWNER_SESSION_MAX_AGE,
    }
  );
  

  redirect("/admin-panel");
}

export async function logoutOwner() {
  const cookieStore = await cookies();
  cookieStore.delete(OWNER_SESSION_COOKIE);
  redirect("/login");
}
 
export async function checkIsOwner() {
  const cookieStore = await cookies();
  const session = cookieStore.get(OWNER_SESSION_COOKIE)?.value;
  return Boolean(session);
}