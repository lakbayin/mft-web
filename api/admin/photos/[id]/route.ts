import { env } from "cloudflare:workers";
import { requireAdmin } from "../../auth";
import { photoCorsOrigin } from "../../../cors";

const corsHeaders = (request: Request) => ({
  "Access-Control-Allow-Origin": photoCorsOrigin(request),
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
  Vary: "Origin",
});

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 403, headers: corsHeaders(request) });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: unknown; storagePath?: unknown; thumbnailStoragePath?: unknown } | null;
  if (typeof body?.storagePath === "string" && typeof body.thumbnailStoragePath === "string") {
    const validBase = /^community-photos\/[A-Za-z0-9_-]+\/[0-9a-f-]{36}\//i;
    if (!validBase.test(body.storagePath) || !validBase.test(body.thumbnailStoragePath)) {
      return Response.json({ error: "Invalid Firebase Storage path" }, { status: 400, headers: corsHeaders(request) });
    }
    const result = await env.DB.prepare("UPDATE establishment_photos SET storage_path = ?, thumbnail_storage_path = ? WHERE id = ? AND status != 'removed'")
      .bind(body.storagePath, body.thumbnailStoragePath, id).run();
    if (!result.meta.changes) {
      return Response.json({ error: "Photo not found" }, { status: 404, headers: corsHeaders(request) });
    }
    return Response.json({ ok: true, storagePath: body.storagePath, thumbnailStoragePath: body.thumbnailStoragePath }, { headers: corsHeaders(request) });
  }
  if (body?.status !== "approved" && body?.status !== "rejected") {
    return Response.json({ error: "Invalid moderation status" }, { status: 400, headers: corsHeaders(request) });
  }
  const result = await env.DB.prepare(
    "UPDATE establishment_photos SET status = ? WHERE id = ? AND status = 'pending'",
  ).bind(body.status, id).run();
  if (!result.meta.changes) {
    return Response.json({ error: "Pending photo not found" }, { status: 404, headers: corsHeaders(request) });
  }
  return Response.json({ ok: true, status: body.status }, { headers: corsHeaders(request) });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 403, headers: corsHeaders(request) });
  }
  const { id } = await params;
  const photo = await env.DB.prepare("SELECT id FROM establishment_photos WHERE id = ? AND status != 'removed'").bind(id).first<{ id: string }>();
  if (!photo) return Response.json({ error: "Photo not found" }, { status: 404, headers: corsHeaders(request) });

  await env.DB.prepare(
    "UPDATE establishment_photos SET status = 'removed' WHERE id = ?",
  )
    .bind(id)
    .run();
  return Response.json({ ok: true, status: "removed" }, { headers: corsHeaders(request) });
}
