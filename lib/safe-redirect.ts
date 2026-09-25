export function getSafeRedirect(value: string | string[] | undefined) {
  const redirectTo = Array.isArray(value) ? value[0] : value;

  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(redirectTo) ||
    new URL(redirectTo, "https://portal.invalid").origin !==
      "https://portal.invalid" ||
    redirectTo.startsWith("/api/")
  ) {
    return "/profile";
  }

  return redirectTo;
}
