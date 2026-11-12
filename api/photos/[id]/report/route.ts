import {env} from "cloudflare:workers";
import {getFirebaseUser} from "../../../firebase-auth";
import {photoCorsOrigin} from "../../../cors";

const corsHeaders=(request:Request)=>({"Access-Control-Allow-Origin":photoCorsOrigin(request),"Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS",Vary:"Origin"});
export async function OPTIONS(request:Request){return new Response(null,{status:204,headers:corsHeaders(request)})}

const createReports=`CREATE TABLE IF NOT EXISTS photo_reports (
  id TEXT PRIMARY KEY NOT NULL,
  photo_id TEXT NOT NULL REFERENCES establishment_photos(id),
  reporter_uid TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
)`;

async function ensureSchema(){
 await env.DB.prepare(createReports).run();
 const info=await env.DB.prepare("PRAGMA table_info(photo_reports)").all<{name:string}>();
 if(!info.results.some(column=>column.name==="reporter_uid"))await env.DB.prepare("ALTER TABLE photo_reports ADD COLUMN reporter_uid TEXT NOT NULL DEFAULT ''").run();
 await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_photo_reports_photo_id ON photo_reports(photo_id)").run();
 await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_photo_reports_photo_user ON photo_reports(photo_id, reporter_uid) WHERE reporter_uid != ''").run();
}

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 const user=await getFirebaseUser(request);
 if(!user)return Response.json({error:"Mag-sign in muna para makapag-report."},{status:401,headers:corsHeaders(request)});
 const {id:photoId}=await params;
 const body=await request.json().catch(()=>null) as {reason?:unknown}|null;
 const reason=typeof body?.reason==="string"?body.reason.trim().slice(0,300):"";
 if(!reason)return Response.json({error:"Please tell us why you are reporting this photo."},{status:400,headers:corsHeaders(request)});
 const photo=await env.DB.prepare("SELECT id FROM establishment_photos WHERE id = ? AND status = 'approved'").bind(photoId).first();
 if(!photo)return Response.json({error:"Photo not found."},{status:404,headers:corsHeaders(request)});
 await ensureSchema();
 const existing=await env.DB.prepare("SELECT id FROM photo_reports WHERE photo_id = ? AND reporter_uid = ?").bind(photoId,user.localId).first();
 if(existing)return Response.json({error:"Na-report mo na ang photo na ito."},{status:409,headers:corsHeaders(request)});
 await env.DB.prepare("INSERT INTO photo_reports (id, photo_id, reporter_uid, reason, created_at) VALUES (?, ?, ?, ?, ?)").bind(crypto.randomUUID(),photoId,user.localId,reason,Date.now()).run();
 return Response.json({ok:true},{status:201,headers:corsHeaders(request)});
}
