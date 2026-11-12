import {ImageResponse} from "next/og";
import {env} from "cloudflare:workers";
import {firebaseStorageUrl} from "../../../../api/firebase-storage";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const photo=await env.DB.prepare("SELECT storage_path AS storagePath FROM establishment_photos WHERE id = ? AND status = 'approved' LIMIT 1").bind(id).first<{storagePath:string}>();
  if(!photo?.storagePath)return new Response("Not found",{status:404});
  const imageUrl=firebaseStorageUrl(photo.storagePath);
  return new ImageResponse(
    <div style={{display:"flex",width:"100%",height:"100%",background:"#f7dfa1",position:"relative"}}>
      <img src={imageUrl} alt="" width="1200" height="630" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{display:"flex",position:"absolute",left:0,right:0,bottom:0,padding:"28px 42px",background:"rgba(53,37,31,.82)",color:"#fff",fontSize:30,fontWeight:800}}>
        Marinduque Food Trip · Kain. Pitik. Share.
      </div>
    </div>,
    {width:1200,height:630,headers:{"Cache-Control":"public, max-age=31536000, immutable"}},
  );
}
