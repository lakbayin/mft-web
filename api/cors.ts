const allowedOrigins = new Set([
  "https://beh-kain-kita.web.app",
  "https://marinduquefoodtrip.com",
  "https://www.marinduquefoodtrip.com",
]);

export function photoCorsOrigin(request: Request) {
  const origin = request.headers.get("origin") || "";
  return allowedOrigins.has(origin) ? origin : "";
}
