import { NextResponse } from "next/server";

/** Require a browser request to originate from this exact site before changing data. */
export function isSameOriginMutation(request: Request) {
  const targetOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");

  if (origin) {
    try {
      return new URL(origin).origin === targetOrigin;
    } catch {
      return false;
    }
  }

  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite) {
    return fetchSite === "same-origin";
  }

  const referer = request.headers.get("referer");

  if (referer) {
    try {
      return new URL(referer).origin === targetOrigin;
    } catch {
      return false;
    }
  }

  return false;
}

export function rejectCrossOriginMutation(request: Request) {
  if (isSameOriginMutation(request)) {
    return null;
  }

  return NextResponse.json({ error: "Запит має надходити з цього сайту." }, { status: 403 });
}
