import {env} from "cloudflare:workers";
import type {Metadata} from "next";
import PhotoShareRedirect from "./photo-share-redirect";
import {firebaseStorageUrl} from "../../../api/firebase-storage";

const siteOrigin="https://marinduquefoodtrip.com";
type SharedPhoto={id:string;establishment:string;town:string;dishName:string;caption:string;contributor:string;storagePath:string};

async function getPhoto(id:string){
  return env.DB.prepare(`SELECT id, establishment, town, dish_name AS dishName, caption, contributor, storage_path AS storagePath
    FROM establishment_photos WHERE id = ? AND status = 'approved' LIMIT 1`).bind(id).first<SharedPhoto>();
}

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  const photo=await getPhoto(id);
  if(!photo)return {title:"Food photo | Marinduque Food Trip",robots:{index:false,follow:false}};
  const title=`${photo.dishName} sa ${photo.establishment}`;
  const description=photo.caption||`Food trip photo shared by ${photo.contributor} in ${photo.town}, Marinduque.`;
  const pageUrl=`${siteOrigin}/photos?photo=${encodeURIComponent(photo.id)}`;
  const imageUrl=firebaseStorageUrl(photo.storagePath);
  return {
    title:`${title} | Marinduque Food Trip`,
    description,
    openGraph:{type:"article",url:pageUrl,title,description,images:[{url:imageUrl,width:1200,height:630,type:"image/png",alt:title}]},
    twitter:{card:"summary_large_image",title,description,images:[imageUrl]},
  };
}

export default async function PhotoSharePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  return <PhotoShareRedirect photoId={id}/>;
}
