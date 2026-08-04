import { NextResponse } from "next/server";
import { adminAuth, isFirebaseAdminConfigured } from "@/firebase/firebaseAdmin";
import { sessionCookieMaxAgeSeconds, sessionCookieName } from "@/lib/auth-session";

export const runtime = "nodejs";

const secureCookie = process.env.NODE_ENV === "production";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: secureCookie,
  });
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json({ error: "Firebase Admin SDK is not configured." }, { status: 503 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const idToken =
    typeof body === "object" && body && "idToken" in body ? (body.idToken as unknown) : undefined;

  if (typeof idToken !== "string" || idToken.length === 0) {
    return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 400 });
  }

  try {
    const expiresIn = sessionCookieMaxAgeSeconds * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ ok: true }, { status: 201 });

    response.cookies.set(sessionCookieName, sessionCookie, {
      httpOnly: true,
      maxAge: sessionCookieMaxAgeSeconds,
      path: "/",
      sameSite: "lax",
      secure: secureCookie,
    });

    return response;
  } catch {
    const response = NextResponse.json({ error: "Could not create session." }, { status: 401 });
    clearSessionCookie(response);

    return response;
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  clearSessionCookie(response);

  return response;
}
