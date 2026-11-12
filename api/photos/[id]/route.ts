import {env} from "cloudflare:workers";
import {getFirebaseUser} from "../../firebase-auth";
import {photoCorsOrigin} from "../../cors";

const corsHeaders=(request:Request)=>({
  "Access-Control-Allow-Origin":photoCorsOrigin(request),
  "Access-Control-Allow-Headers":"Authorization, Content-Type",
  "Access-Control-Allow-Methods":"PATCH, DELETE, OPTIONS",
  Vary:"Origin",
});

export async function OPTIONS(request:Request){return new Response(null,{status:204,headers:corsHeaders(request)})}

async function ownedPhoto(request:Request,id:string){
  const user=await getFirebaseUser(request);
  if(!user)return {error:Response.json({error:"Mag-sign in muna."},{status:401,headers:corsHeaders(request)})};
  const photo=await env.DB.prepare("SELECT id, r2_key AS r2Key, storage_path AS storagePath, thumbnail_storage_path AS thumbnailStoragePath FROM establishment_photos WHERE id = ? AND uploader_uid = ? AND status != 'removed'").bind(id,user.localId).first<{id:string;r2Key:string;storagePath?:string;thumbnailStoragePath?:string}>();
  if(!photo)return {error:Response.json({error:"Hindi makita ang photo."},{status:404,headers:corsHeaders(request)})};
  return {photo};
}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const owned=await ownedPhoto(request,id);
  if("error" in owned)return owned.error;
  const body=await request.json().catch(()=>null) as {status?:unknown}|null;
  if(body?.status!=="archived"&&body?.status!=="approved")return Response.json({error:"Invalid photo status."},{status:400,headers:corsHeaders(request)});
  await env.DB.prepare("UPDATE establishment_photos SET status = ? WHERE id = ?").bind(body.status,id).run();
  return Response.json({ok:true,status:body.status},{headers:corsHeaders(request)});
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const owned=await ownedPhoto(request,id);
  if("error" in owned)return owned.error;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS photo_reports (id TEXT PRIMARY KEY NOT NULL, photo_id TEXT NOT NULL REFERENCES establishment_photos(id), reason TEXT NOT NULL, created_at INTEGER NOT NULL)").run();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM photo_reactions WHERE photo_id = ?").bind(id),
    env.DB.prepare("DELETE FROM photo_reports WHERE photo_id = ?").bind(id),
    env.DB.prepare("DELETE FROM establishment_photos WHERE id = ?").bind(id),
  ]);
  if(!owned.photo.storagePath)await Promise.all([env.PHOTOS.delete(owned.photo.r2Key),env.PHOTOS.delete(`thumbnails/${id}.png`)]);
  return Response.json({ok:true,storagePath:owned.photo.storagePath,thumbnailStoragePath:owned.photo.thumbnailStoragePath},{headers:corsHeaders(request)});
}
