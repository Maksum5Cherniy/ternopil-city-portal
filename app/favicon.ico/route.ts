export function GET(request: Request) {
  return Response.redirect(new URL("/app-icon.svg", request.url), 308);
}
