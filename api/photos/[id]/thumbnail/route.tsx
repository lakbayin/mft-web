import {env} from "cloudflare:workers";
import {ImageResponse} from "next/og";
import {photoCorsOrigin} from "../../../cors";
import {firebaseStorageUrl} from "../../../firebase-storage";

const headers=(request:Request)=>({
  "Access-Control-Allow-Origin":photoCorsOrigin(request),
  "Access-Control-Allow-Methods":"GET, OPTIONS",
  "Cache-Control":"public, max-age=31536000, immutable",
  Vary:"Origin",
});

export async function OPTIONS(request:Request){return new Response(null,{status:204,headers:headers(request)})}

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const photo=await env.DB.prepare("SELECT id, r2_key AS r2Key, thumbnail_storage_path AS thumbnailStoragePath, content_type AS contentType FROM establishment_photos WHERE id = ? AND status IN ('approved', 'archived')").bind(id).first<{id:string;r2Key:string;thumbnailStoragePath?:string;contentType:string}>();
  if(!photo)return new Response("Not found",{status:404,headers:headers(request)});
  if(photo.thumbnailStoragePath){
    return Response.redirect(firebaseStorageUrl(photo.thumbnailStoragePath),302);
  }
  const key=`thumbnails/${id}.png`;
  const cached=await env.PHOTOS.get(key);
  if(cached)return new Response(cached.body,{headers:{...headers(request),"Content-Type":"image/png"}});
  const originalUrl=`${new URL(request.url).origin}/api/photos/${encodeURIComponent(id)}/image`;
  try{
    const generated=new ImageResponse(
      <div style={{display:"flex",width:"100%",height:"100%",background:"#f7dfa1"}}>
        <img src={originalUrl} alt="" width="512" height="512" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>,
      {width:512,height:512},
    );
    const bytes=await generated.arrayBuffer();
    await env.PHOTOS.put(key,bytes,{httpMetadata:{contentType:"image/png"}});
    return new Response(bytes,{headers:{...headers(request),"Content-Type":"image/png"}});
  }catch{
    const original=await env.PHOTOS.get(photo.r2Key);
    if(!original)return new Response("Not found",{status:404,headers:headers(request)});
    return new Response(original.body,{headers:{...headers(request),"Content-Type":photo.contentType}});
  }
}
