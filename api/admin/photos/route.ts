import { env } from "cloudflare:workers";
import { requireAdmin } from "../auth";
import { photoCorsOrigin } from "../../cors";
import { firebaseStorageUrl } from "../../firebase-storage";

const corsHeaders = (request: Request) => ({
  "Access-Control-Allow-Origin": photoCorsOrigin(request),
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  Vary: "Origin",
});

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

const createReports = `CREATE TABLE IF NOT EXISTS photo_reports (
  id TEXT PRIMARY KEY NOT NULL,
  photo_id TEXT NOT NULL REFERENCES establishment_photos(id),
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
)`;

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 403, headers: corsHeaders(request) });
  }
  try {
  const tableInfo = await env.DB.prepare("PRAGMA table_info(establishment_photos)").all<{ name: string }>();
  const columns = new Set(tableInfo.results.map((column) => column.name));
  const additions = [];
  if (!columns.has("storage_path")) additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN storage_path TEXT"));
  if (!columns.has("thumbnail_storage_path")) additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN thumbnail_storage_path TEXT"));
  if (additions.length) await env.DB.batch(additions);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS photo_reactions (id TEXT PRIMARY KEY NOT NULL, photo_id TEXT NOT NULL REFERENCES establishment_photos(id), user_uid TEXT NOT NULL, created_at INTEGER NOT NULL)").run();
  await env.DB.prepare(createReports).run();
  const [result, reactions, reports] = await Promise.all([env.DB.prepare(`
    SELECT
      p.id,
      p.establishment,
      p.town,
      p.dish_name AS dishName,
      p.caption,
      p.contributor,
      p.status,
      p.uploader_uid AS uploaderUid,
      p.storage_path AS storagePath,
      p.thumbnail_storage_path AS thumbnailStoragePath,
      p.created_at AS createdAt,
      (SELECT COUNT(*) FROM photo_reactions pr WHERE pr.photo_id = p.id) AS reactionCount,
      COUNT(r.id) AS reportCount,
      GROUP_CONCAT(r.reason, ' • ') AS reportReasons
    FROM establishment_photos p
    LEFT JOIN photo_reports r ON r.photo_id = p.id
    WHERE p.status != 'removed'
    GROUP BY p.id
    ORDER BY reportCount DESC, p.created_at DESC
    LIMIT 200
  `).all(), env.DB.prepare("SELECT photo_id AS photoId, user_uid AS userUid, created_at AS createdAt FROM photo_reactions").all(), env.DB.prepare("SELECT id, photo_id AS photoId, reason, created_at AS createdAt FROM photo_reports").all()]);
  return Response.json(
    {
      photos: result.results.map((row) => ({
        ...row,
        reactions: reactions.results.filter((reaction) => reaction.photoId === row.id),
        reports: reports.results.filter((report) => report.photoId === row.id),
        imageUrl: typeof row.storagePath === "string" && row.storagePath
          ? firebaseStorageUrl(row.storagePath)
          : `${new URL(request.url).origin}/api/admin/photos/${row.id}/image`,
      })),
    },
    { headers: { "Cache-Control": "no-store", ...corsHeaders(request) } },
  );
  } catch (error) {
    console.error("Admin photo query failed", error);
    return Response.json(
      { error: "Hindi mabasa ang community photo records ngayon." },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}
