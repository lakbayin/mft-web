import {env} from "cloudflare:workers";
import {getFirebaseUser,verifyFirebaseIdToken} from "../firebase-auth";
import {photoCorsOrigin} from "../cors";
import {firebaseStorageUrl} from "../firebase-storage";

const corsHeaders=(request:Request)=>({
  "Access-Control-Allow-Origin":photoCorsOrigin(request),
  "Access-Control-Allow-Headers":"Authorization, Content-Type",
  "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
  "Vary":"Origin",
});

export async function OPTIONS(request:Request){
  return new Response(null,{status:204,headers:corsHeaders(request)});
}

const createTable=`CREATE TABLE IF NOT EXISTS establishment_photos (
  id TEXT PRIMARY KEY NOT NULL,
  establishment TEXT NOT NULL,
  town TEXT NOT NULL DEFAULT 'Boac',
  dish_name TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  contributor TEXT NOT NULL DEFAULT 'Anonymous beh',
  status TEXT NOT NULL DEFAULT 'approved',
  r2_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  uploader_uid TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
)`;

async function ensureSchema(){
  await env.DB.prepare(createTable).run();
  const tableInfo=await env.DB.prepare("PRAGMA table_info(establishment_photos)").all<{name:string}>();
  const columns=new Set(tableInfo.results.map(column=>column.name));
  const additions=[];
  if(!columns.has("town"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN town TEXT NOT NULL DEFAULT 'Boac'"));
  if(!columns.has("dish_name"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN dish_name TEXT NOT NULL DEFAULT ''"));
  if(!columns.has("contributor"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN contributor TEXT NOT NULL DEFAULT 'Anonymous beh'"));
  if(!columns.has("status"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'"));
  if(!columns.has("uploader_uid"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN uploader_uid TEXT NOT NULL DEFAULT ''"));
  if(!columns.has("storage_path"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN storage_path TEXT"));
  if(!columns.has("thumbnail_storage_path"))additions.push(env.DB.prepare("ALTER TABLE establishment_photos ADD COLUMN thumbnail_storage_path TEXT"));
  if(additions.length)await env.DB.batch(additions);
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_establishment_photos_created_at ON establishment_photos(created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_establishment_photos_status_created_at ON establishment_photos(status, created_at)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS photo_reactions (id TEXT PRIMARY KEY NOT NULL, photo_id TEXT NOT NULL REFERENCES establishment_photos(id), user_uid TEXT NOT NULL, created_at INTEGER NOT NULL)").run();
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_photo_reactions_photo_user ON photo_reactions(photo_id, user_uid)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_photo_reactions_photo_id ON photo_reactions(photo_id)").run();
  await env.DB.prepare("UPDATE establishment_photos SET town = 'Boac' WHERE establishment = 'Café Rajo' AND town = 'Mogpog'").run();
  await env.DB.prepare("PRAGMA optimize").run();
}

export async function GET(request:Request){
  await ensureSchema();
  const user=await getFirebaseUser(request);
  const params=new URL(request.url).searchParams;
  const establishment=params.get("establishment")?.trim();
  const mine=params.get("mine")==="1";
  if(params.get("stats")==="mine"){
    if(!user)return Response.json({error:"Sign in required."},{status:401});
    const now=new Date();
    const monthStart=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1);
    const [monthCount,totalCount]=await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS total FROM establishment_photos WHERE uploader_uid = ? AND created_at >= ? AND status != 'removed'").bind(user.localId,monthStart).first<{total:number}>(),
      env.DB.prepare("SELECT COUNT(*) AS total FROM establishment_photos WHERE uploader_uid = ? AND status != 'removed'").bind(user.localId).first<{total:number}>(),
    ]);
    return Response.json({sharedThisMonth:Number(monthCount?.total||0),sharedTotal:Number(totalCount?.total||0)},{headers:{"Cache-Control":"no-store"}});
  }
  const base=`SELECT p.id, p.establishment, p.town, p.dish_name AS dishName, p.caption, p.contributor, p.status, p.created_at AS createdAt,
    p.storage_path AS storagePath, p.thumbnail_storage_path AS thumbnailStoragePath,
    (SELECT COUNT(*) FROM photo_reactions r WHERE r.photo_id = p.id) AS reactionCount,
    EXISTS(SELECT 1 FROM photo_reactions r WHERE r.photo_id = p.id AND r.user_uid = ?) AS reacted
    FROM establishment_photos p`;
  if(mine&&!user)return Response.json({error:"Sign in required."},{status:401,headers:corsHeaders(request)});
  const result=mine
    ?await env.DB.prepare(`${base} WHERE p.status IN ('approved', 'archived') AND p.uploader_uid = ? ORDER BY p.created_at DESC LIMIT 100`).bind(user?.localId||"",user?.localId||"").all()
    :establishment
    ?await env.DB.prepare(`${base} WHERE p.status = 'approved' AND p.establishment = ? ORDER BY p.created_at DESC LIMIT 12`).bind(user?.localId||"",establishment).all()
    :await env.DB.prepare(`${base} WHERE p.status = 'approved' ORDER BY p.created_at DESC LIMIT 100`).bind(user?.localId||"").all();
  const origin=new URL(request.url).origin;
  return Response.json({photos:result.results.map(row=>{
    const storagePath=typeof row.storagePath==="string"?row.storagePath:"";
    const thumbnailStoragePath=typeof row.thumbnailStoragePath==="string"?row.thumbnailStoragePath:"";
    return {
      ...row,
      ...(!mine?{storagePath:undefined,thumbnailStoragePath:undefined}:{}),
      imageUrl:storagePath?firebaseStorageUrl(storagePath):`${origin}/api/photos/${row.id}/image`,
      thumbnailUrl:thumbnailStoragePath?firebaseStorageUrl(thumbnailStoragePath):`${origin}/api/photos/${row.id}/thumbnail`,
    };
  })},{headers:{"Cache-Control":"no-store",...corsHeaders(request)}});
}

export async function POST(request:Request){
  const form=await request.formData();
  const user=await verifyFirebaseIdToken(String(form.get("idToken")||""));
  if(!user)return Response.json({error:"Mag-sign in muna para makapag-share ng photo."},{status:401,headers:corsHeaders(request)});
  await ensureSchema();
  const file=form.get("photo");
  const requestedId=String(form.get("photoId")||"").trim();
  const storagePath=String(form.get("storagePath")||"").trim();
  const thumbnailStoragePath=String(form.get("thumbnailStoragePath")||"").trim();
  const uploadedContentType=String(form.get("contentType")||"").trim();
  const establishment=String(form.get("establishment")||"").trim().slice(0,120);
  const town=String(form.get("town")||"").trim().slice(0,40);
  const dishName=String(form.get("dishName")||"").trim().slice(0,100);
  const caption=String(form.get("caption")||"").trim().slice(0,240);
  const contributor=String(form.get("contributor")||"").trim().slice(0,60);
  const consent=form.get("consent")==="on";
  if(!establishment||!town||!dishName||!contributor||!consent)return Response.json({error:"Please complete the required fields and photo consent."},{status:400,headers:corsHeaders(request)});
  const firebaseUpload=Boolean(requestedId&&storagePath&&thumbnailStoragePath);
  const id=firebaseUpload?requestedId:crypto.randomUUID();
  if(firebaseUpload){
    const allowedPrefix=`community-photos/${user.localId}/${id}/`;
    if(!/^[0-9a-f-]{36}$/i.test(id)||!storagePath.startsWith(allowedPrefix)||!thumbnailStoragePath.startsWith(allowedPrefix))return Response.json({error:"Invalid Firebase photo path."},{status:400,headers:corsHeaders(request)});
    if(!["image/jpeg","image/png","image/webp"].includes(uploadedContentType))return Response.json({error:"Please upload a JPG, PNG, or WebP image."},{status:415,headers:corsHeaders(request)});
  }else{
    if(!(file instanceof File))return Response.json({error:"Please choose a photo."},{status:400,headers:corsHeaders(request)});
    if(!["image/jpeg","image/png","image/webp"].includes(file.type))return Response.json({error:"Please upload a JPG, PNG, or WebP image."},{status:415,headers:corsHeaders(request)});
    if(file.size>5*1024*1024)return Response.json({error:"Photo must be 5 MB or smaller."},{status:413,headers:corsHeaders(request)});
  }
  const contentType=firebaseUpload?uploadedContentType:(file as File).type;
  const extension=contentType==="image/png"?"png":contentType==="image/webp"?"webp":"jpg";
  const key=firebaseUpload?`firebase:${storagePath}`:`establishments/${id}.${extension}`;
  if(!firebaseUpload)await env.PHOTOS.put(key,(file as File).stream(),{httpMetadata:{contentType}});
  try{
    await env.DB.prepare("INSERT INTO establishment_photos (id, establishment, town, dish_name, caption, contributor, status, r2_key, content_type, uploader_uid, created_at, storage_path, thumbnail_storage_path) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?, ?, ?, ?)").bind(id,establishment,town,dishName,caption,contributor,key,contentType,user.localId,Date.now(),firebaseUpload?storagePath:null,firebaseUpload?thumbnailStoragePath:null).run();
  }catch(error){if(!firebaseUpload)await env.PHOTOS.delete(key);throw error}
  return Response.json({ok:true,id,status:"approved"},{status:201,headers:corsHeaders(request)});
}
