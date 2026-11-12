import type {Metadata} from "next";
import {establishments,getEstablishment} from "../data";
import CommunityPhotos from "./community-photos";
import "../../community-profile.css";

const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const todayIndex=()=>{const day=new Date().getDay();return day===0?6:day-1};

export function generateStaticParams(){return establishments.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const item=getEstablishment(slug);
 if(!item)return {title:"Establishment not found | Marinduque Food Trip"};
 const description=`${item.category} in ${item.address}. View establishment information on Marinduque Food Trip`;
 return {title:`${item.name} | Marinduque Food Trip`,description,openGraph:{title:item.name,description,images:[]},twitter:{card:"summary",title:item.name,description,images:[]}};
}

export default async function EstablishmentPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const item=getEstablishment(slug);
 if(!item)return <main className="detail-missing"><h1>Hindi makita ang kainan.</h1><a href="/">Bumalik sa directory</a></main>;
 const today=todayIndex();const hasHours=Boolean(item.hours&&Object.keys(item.hours).length);
 return <div className="app-shell detail-shell">
  <header className="topbar"><a className="menu-button back-link" href="/" aria-label="Bumalik sa directory">←</a><a className="brand" href="/">Marinduque Food Trip</a><a className="photo-nav-icon" href="/photos" aria-label="Community photos">📷</a></header>
  <main className="detail-page">
   <p className="detail-kicker">Establishment profile · {item.town}</p>
   <section className="detail-hero">
    <div className="detail-identity"><span className="detail-category">{item.category}</span><h1>{item.name}</h1><p>Local food stop in Marinduque</p>{item.facebook?<a className="social-link" href={item.facebook} target="_blank" rel="noreferrer">Visit social media ↗</a>:<span className="social-unavailable">Social media link not available</span>}</div>
    <aside className="detail-info">
     <section className="info-block address-block"><span className="pin-glyph">⌖</span><div><p>Address</p><h2>{item.address}</h2></div></section>
     <section className="info-block hours-block"><div className="hours-heading"><p>Opening hours</p><span>{hasHours?"From establishment list":"Not yet verified"}</span></div><ol>{days.map((day,index)=><li className={index===today?"today":""} key={day}><span>{day}{index===today&&<b>Today</b>}</span><time>{item.hours?.[day]||"Not yet verified"}</time></li>)}</ol></section>
     <footer className="detail-facts"><span><b>Payment</b>Not yet verified</span><span><b>Wi-Fi</b>Not yet verified</span><span><b>Dog policy</b>Not yet verified</span></footer>
    </aside>
   </section>
   <CommunityPhotos establishment={item.name}/>
  </main>
 </div>;
}
