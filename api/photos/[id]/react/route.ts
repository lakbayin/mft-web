import {env} from "cloudflare:workers";
import {getFirebaseUser} from "../../../firebase-auth";
import {photoCorsOrigin} from "../../../cors";

const corsHeaders=(request:Request)=>({"Access-Control-Allow-Origin":photoCorsOrigin(request),"Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS",Vary:"Origin"});
export async function OPTIONS(request:Request){return new Response(null,{status:204,headers:corsHeaders(request)})}

async function ensureSchema(){
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS photo_reactions (id TEXT PRIMARY KEY NOT NULL, photo_id TEXT NOT NULL REFERENCES establishment_photos(id), user_uid TEXT NOT NULL, created_at INTEGER NOT NULL)").run();
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_photo_reactions_photo_user ON photo_reactions(photo_id, user_uid)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_photo_reactions_photo_id ON photo_reactions(photo_id)").run();
}

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getFirebaseUser(request);
  if(!user)return Response.json({error:"Mag-sign in muna para makapag-react."},{status:401,headers:corsHeaders(request)});
  await ensureSchema();
  const {id:photoId}=await params;
  const photo=await env.DB.prepare("SELECT id FROM establishment_photos WHERE id = ? AND status = 'approved'").bind(photoId).first();
  if(!photo)return Response.json({error:"Hindi makita ang photo."},{status:404,headers:corsHeaders(request)});
  const existing=await env.DB.prepare("SELECT id FROM photo_reactions WHERE photo_id = ? AND user_uid = ?").bind(photoId,user.localId).first<{id:string}>();
  if(existing){
    await env.DB.prepare("DELETE FROM photo_reactions WHERE id = ?").bind(existing.id).run();
  }else{
    await env.DB.prepare("INSERT INTO photo_reactions (id, photo_id, user_uid, created_at) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(),photoId,user.localId,Date.now()).run();
  }
  const count=await env.DB.prepare("SELECT COUNT(*) AS count FROM photo_reactions WHERE photo_id = ?").bind(photoId).first<{count:number}>();
  return Response.json({reacted:!existing,reactionCount:Number(count?.count||0)},{headers:corsHeaders(request)});
}
