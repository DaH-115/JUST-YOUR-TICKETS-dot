"use server";

import { cookies } from "next/headers";

export async function setSessionCookie(token: string) {
  const isProduction = process.env.NODE_ENV === "production";

  cookies().set("firebase-session-token", token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 86400,
    path: "/",
    sameSite: "lax",
  });
}
