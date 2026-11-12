"use client";
import {useState} from "react";

const steps=[
 {icon:"🌴",eyebrow:"Mabuhay, beh!",title:"Saan baga kita makain?",copy:"Tara, ikot kita sa masasarap na kainan sa Marinduque na siguradong babalik-balikan mo! Oh, hindi si ex ang babalikan ha?",feature:"Anim na bayan, isang masarap na food trip"},
 {icon:"🧭",eyebrow:"Tara, food trip!",title:"Bawat kainan, may kuwento",copy:"I-tsek ang mga natry at gusto mo pang itry na kainan. Kami na ang bahalang magpaalala sa'yo kung gaano kalayo na ang iyong narating!",feature:"Napuntahan · Gustong puntahan · Mga badge"},
 {icon:"📷",eyebrow:"Kwentong pagkaing Marinduque",title:"I-share mo rin, beh!",copy:"May masarap kang nadiskubre? Ibahagi ang litrato at tuksohin—este, tulungan—ang kapwa foodies na mahanap ang susunod nilang paboritong kainan.",feature:"Mga kuha, kuwento, at tuklas ng komunidad"},
];

const featuredPlaces=[
 {icon:"☕",name:"Tambayan sa Curba",town:"Boac",kind:"Coffee Shop / Cafe"},
 {icon:"🍽️",name:"Roger's Cafe",town:"Gasan",kind:"Casual Dining"},
 {icon:"🧋",name:"Café Aurora",town:"Buenavista",kind:"Cafe / Milktea Shop"},
 {icon:"🍲",name:"Panuluyan Farmstay",town:"Sta. Cruz",kind:"Lutong Lokal"},
];

export default function WelcomePage(){
 const[step,setStep]=useState(0);const item=steps[step];const last=step===steps.length-1;
 const businessGroup=(copy:number)=><div className="business-group" aria-hidden={copy===1}>{featuredPlaces.map(place=><article className="business-slide" key={`${copy}-${place.name}`}><span className="business-icon">{place.icon}</span><p>{place.kind}</p><h2>{place.name}</h2><b>📍 {place.town}, Marinduque</b></article>)}</div>;
 return <main className="onboarding-page"><a className="onboarding-brand" href="/">Beh, kain kita!</a><section className="onboarding-card"><div className={`onboarding-visual visual-${step}`}><div className="business-carousel" aria-label="Mga tampok na kainan sa Marinduque"><div className="business-track">{businessGroup(0)}{businessGroup(1)}</div></div><b className="island-note">Ikot-ikot lang ni Sarah G., Marinduque version!</b></div><div className="onboarding-copy"><p className="onboarding-eyebrow">✦ {item.eyebrow}</p><h1>{item.title}</h1><p>{item.copy}</p><div className="onboarding-feature"><span>✓</span>{item.feature}</div><div className="onboarding-progress" aria-label={`Hakbang ${step+1} sa ${steps.length}`}>{steps.map((_,index)=><button type="button" className={index===step?"active":""} onClick={()=>setStep(index)} aria-label={`Pumunta sa hakbang ${index+1}`} aria-current={index===step?"step":undefined} key={index}/>)}</div>{last?<div className="onboarding-actions"><a className="create-account" href="/signup">Tara, gawa tayo ng account →</a><a className="signin-link" href="/signin">May account na ako — Sign in</a><a className="guest-link" href="/">Ikot muna bilang bisita</a></div>:<div className="onboarding-actions"><button className="create-account" onClick={()=>setStep(step+1)}>Sige, sunod →</button><a className="signin-link" href="/signin">May account na ako — Sign in</a><a className="guest-link" href="/">Ikot muna (takot pa ako sa commitment. Eme.)</a></div>}</div></section><small className="onboarding-note">Para hindi mawala ang mga bet mong kainan, iugnay natin sa account mo.</small></main>;
}
