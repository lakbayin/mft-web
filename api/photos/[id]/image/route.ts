import {env} from "cloudflare:workers";
import {photoCorsOrigin} from "../../../cors";
import {firebaseStorageUrl} from "../../../firebase-storage";

const corsHeaders=(request:Request)=>({
  "Access-Control-Allow-Origin":photoCorsOrigin(request),
  "Access-Control-Allow-Methods":"GET, OPTIONS",
  "Vary":"Origin",
});

export async function OPTIONS(request:Request){
  return new Response(null,{status:204,headers:corsHeaders(request)});
}

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const row=await env.DB.prepare("SELECT r2_key AS r2Key, storage_path AS storagePath, content_type AS contentType FROM establishment_photos WHERE id = ? AND status IN ('approved', 'archived')").bind(id).first<{r2Key:string;storagePath?:string;contentType:string}>();
  if(!row)return new Response("Not found",{status:404});
  if(row.storagePath){
    return Response.redirect(firebaseStorageUrl(row.storagePath),302);
  }
  const object=await env.PHOTOS.get(row.r2Key);
  if(!object)return new Response("Not found",{status:404});
  return new Response(object.body,{headers:{"Content-Type":row.contentType,"Cache-Control":"public, max-age=31536000, immutable",...corsHeaders(request)}});
}
