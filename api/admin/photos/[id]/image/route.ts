import { env } from "cloudflare:workers";
import { requireAdmin } from "../../../auth";
import { photoCorsOrigin } from "../../../../cors";
import { firebaseStorageUrl } from "../../../../firebase-storage";

export async function OPTIONS(request: Request) {
  const origin = photoCorsOrigin(request);
  return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "Authorization", "Access-Control-Allow-Methods": "GET, OPTIONS", Vary: "Origin" } });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const origin = photoCorsOrigin(request);
  const headers = { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
  if (!(await requireAdmin(request))) return new Response("Unauthorized", { status: 403, headers });
  const { id } = await params;
  const row = await env.DB.prepare("SELECT r2_key AS r2Key, storage_path AS storagePath, content_type AS contentType FROM establishment_photos WHERE id = ? AND status != 'removed'").bind(id).first<{ r2Key: string; storagePath?: string; contentType: string }>();
  if (!row) return new Response("Not found", { status: 404, headers });
  if (row.storagePath) {
    return Response.redirect(firebaseStorageUrl(row.storagePath), 302);
  }
  const object = await env.PHOTOS.get(row.r2Key);
  if (!object) return new Response("Not found", { status: 404, headers });
  return new Response(object.body, { headers: { ...headers, "Content-Type": row.contentType, "Cache-Control": "private, no-store" } });
}
