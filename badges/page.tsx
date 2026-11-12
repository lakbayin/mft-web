"use client";

import { useMemo, useState } from "react";

type BadgeState = "earned" | "progress" | "locked";

type Badge = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  icon: string;
  color: string;
  state: BadgeState;
  progress: number;
  target: number;
  unit: string;
  reward: string;
};

const badges: Badge[] = [
  { id: "first-bite", name: "Unang Kagat", eyebrow: "Starter badge", description: "Na-log mo ang unang kainan sa food trip mo.", icon: "✦", color: "coral", state: "earned", progress: 1, target: 1, unit: "kainan", reward: "Unlocked · Set 6, 2026" },
  { id: "boac-bites", name: "Boac Bites", eyebrow: "Town badge", description: "Tikman ang limang local favorites sa kabisera.", icon: "B", color: "mango", state: "progress", progress: 3, target: 5, unit: "kainan", reward: "2 na lang para ma-unlock" },
  { id: "island-hopper", name: "Island Hopper", eyebrow: "Explorer badge", description: "Kumain sa tatlong magkaibang bayan ng Marinduque.", icon: "↗", color: "sea", state: "progress", progress: 2, target: 3, unit: "bayan", reward: "1 bayan na lang" },
  { id: "kakanin", name: "Kakanin Connoisseur", eyebrow: "Food badge", description: "Subukan ang tatlong tradisyonal na merienda o kakanin.", icon: "◇", color: "ube", state: "progress", progress: 1, target: 3, unit: "kakanin", reward: "2 tikim na lang" },
  { id: "market", name: "Palengke Pro", eyebrow: "Local badge", description: "Mag-log ng almusal mula sa dalawang public market.", icon: "☀", color: "leaf", state: "locked", progress: 0, target: 2, unit: "palengke", reward: "Magsimula sa Boac Market" },
  { id: "six-towns", name: "Anim na Bayan", eyebrow: "Legend badge", description: "Kumpletuhin ang food trip sa lahat ng anim na bayan.", icon: "6", color: "clay", state: "locked", progress: 2, target: 6, unit: "bayan", reward: "4 bayan pa ang naghihintay" },
];

const filters = ["Lahat", "Nakuha", "In progress", "Locked"] as const;
type Filter = (typeof filters)[number];

export default function BadgesPage() {
  const [filter, setFilter] = useState<Filter>("Lahat");
  const [selected, setSelected] = useState<Badge>(badges[1]);
  const visible = useMemo(() => badges.filter((badge) => {
    if (filter === "Nakuha") return badge.state === "earned";
    if (filter === "In progress") return badge.state === "progress";
    if (filter === "Locked") return badge.state === "locked";
    return true;
  }), [filter]);

  return (
    <main className="badges-page">
      <nav className="badges-nav" aria-label="Main navigation">
        <a className="badges-wordmark" href="/">Marinduque <i>Food Trip</i></a>
        <div className="badges-navlinks">
          <a href="/directory">Kainan</a>
          <a href="/photos">Mga pitik</a>
          <a className="active" href="/badges">Badges</a>
        </div>
        <a className="badges-profile" href="/account" aria-label="Buksan ang profile">JP</a>
      </nav>

      <header className="badges-hero">
        <div className="badges-hero-copy">
          <p className="badges-kicker"><span>✦</span> Ang food journey mo</p>
          <h1>Kolektahin ang<br/><em>kuwento ng isla.</em></h1>
          <p>Bawat kainan, bayan, at bagong tikim ay may katumbas na badge. Tara—unti-unting kumpletuhin ang Marinduque.</p>
        </div>
        <div className="passport-card" aria-label="Iyong badge progress">
          <span className="passport-label">Food trip passport</span>
          <strong>2</strong>
          <p>sa 12 badges</p>
          <div className="passport-stamps" aria-hidden="true"><i>✓</i><i>✦</i><i>?</i></div>
          <small>Susunod: Boac Bites · 3/5</small>
        </div>
      </header>

      <section className="badges-content">
        <div className="badges-heading-row">
          <div><span>Badge cabinet</span><h2>Mga badge mo</h2></div>
          <div className="badges-filters" role="group" aria-label="I-filter ang badges">
            {filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
        </div>

        <div className="badges-layout">
          <div className="badge-grid">
            {visible.map((badge) => {
              const percent = Math.min(100, badge.progress / badge.target * 100);
              return <button type="button" onClick={() => setSelected(badge)} className={`badge-card ${badge.color} ${badge.state} ${selected.id === badge.id ? "selected" : ""}`} key={badge.id}>
                <span className="badge-status">{badge.state === "earned" ? "✓ Nakuha" : badge.state === "locked" ? "Naka-lock" : "Ginagawa"}</span>
                <span className="badge-medallion" aria-hidden="true"><i>{badge.icon}</i></span>
                <span className="badge-eyebrow">{badge.eyebrow}</span>
                <strong>{badge.name}</strong>
                <span className="badge-description">{badge.description}</span>
                <span className="badge-progress"><i style={{ width: `${percent}%` }}/></span>
                <span className="badge-count"><b>{badge.progress}/{badge.target}</b> {badge.unit}</span>
              </button>;
            })}
          </div>

          <aside className={`badge-detail ${selected.color}`} aria-live="polite">
            <p>Napiling badge</p>
            <span className="badge-detail-icon">{selected.icon}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="detail-progress"><i style={{ width: `${Math.min(100, selected.progress / selected.target * 100)}%` }}/></div>
            <div className="detail-meta"><span>Progress</span><b>{selected.progress} / {selected.target} {selected.unit}</b></div>
            <div className="detail-note">{selected.state === "earned" ? "✓ " : "→ "}{selected.reward}</div>
            <a href="/directory">Maghanap ng susunod na kainan <span>↗</span></a>
          </aside>
        </div>
      </section>

      <footer className="badges-footer"><span>Gawa para sa masasarap na biyahe.</span><b>♥ Marinduque</b></footer>
    </main>
  );
}
