"use client";

import {useEffect} from "react";

export default function PhotoShareRedirect({photoId}:{photoId:string}){
  const destination=`https://marinduquefoodtrip.com/photos?photo=${encodeURIComponent(photoId)}`;
  useEffect(()=>{window.location.replace(destination)},[destination]);
  return <main className="firebase-redirect"><p>Binubuksan ang shared food photo…</p><a href={destination}>Tingnan ang photo →</a></main>;
}
