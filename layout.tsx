import type {Metadata} from "next";
import "./globals.css";
import "./photos.css";
import "./details.css";
import "./report-photo.css";
import "./reaction-auth.css";
import "./onboarding.css";
import "./onboarding-warm.css";
import "./signup.css";
import "./account.css";
import "./admin.css";
import "./jeep-hero.css";
import "./badges.css";
import FirebaseFrontendRedirect from "./firebase-frontend-redirect";
export const metadata:Metadata={title:"Marinduque Food Trip | Marinduque Food Directory",description:"Hanapin ang mga cafe, kainan, at lutong lokal sa Boac, Marinduque.",openGraph:{title:"Marinduque Food Trip",description:"Marinduque Food Directory",images:[]},twitter:{card:"summary",title:"Marinduque Food Trip",description:"Marinduque Food Directory",images:[]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fil"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet"/></head><body><FirebaseFrontendRedirect/>{children}<noscript><div className="firebase-redirect"><p>Ang official site ay nasa Firebase.</p><a href="https://marinduquefoodtrip.com">Magpatuloy sa Marinduque Food Trip →</a></div></noscript></body></html>}
