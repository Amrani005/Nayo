import { createHmac, timingSafeEqual } from "node:crypto";

export const OWNER_SESSION_COOKIE = "nayo_owner_session";
export const OWNER_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type OwnerSession = {
  email: string;
  expiresAt: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET;
}

export function createOwnerSessionToken(email: string) {
  const secret = getAuthSecret();
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }

  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      expiresAt: Math.floor(Date.now() / 1000) + OWNER_SESSION_MAX_AGE,
    } satisfies OwnerSession)
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyOwnerSessionToken(token?: string) {
  const secret = getAuthSecret();
  const configuredEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (!secret || secret.length < 32 || !configuredEmail || !token) {
    return false;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0 || separator === token.length - 1) {
    return false;
  }

  const payload = token.slice(0, separator);
  const suppliedSignature = Buffer.from(token.slice(separator + 1));
  const expectedSignature = Buffer.from(
    createHmac("sha256", secret).update(payload).digest("base64url")
  );

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const session: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (
      typeof session !== "object" ||
      session === null ||
      !("email" in session) ||
      !("expiresAt" in session) ||
      typeof session.email !== "string" ||
      typeof session.expiresAt !== "number"
    ) {
      return false;
    }

    return (
      session.email === configuredEmail &&
      session.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
