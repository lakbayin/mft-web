"use client";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  establishments,
  slugify,
  type Establishment,
} from "./establishments/data";
import { auth } from "./firebase";
import {
  connectUserJourney,
  getLocalJourney,
  saveUserJourney,
  subscribeToUserJourney,
  type VisitEntry,
  type VisitStatus,
} from "./user-journey";

type Place = Establishment & { icon: string };
type CommunityPhoto = {
  id: string;
  establishment: string;
  town: string;
  dishName: string;
  contributor: string;
  imageUrl: string;
  reactionCount: number;
};

const iconByCategory: Record<string, string> = {
  "Coffee Shop / Cafe": "☕",
  "Casual Dining": "🍽️",
  "Specialty / Local Dishes": "🍲",
  Cafeteria: "🍛",
  "Cafe / Milktea Shop": "🧋",
  Pub: "🍻",
};

const places: Place[] = establishments.map((item) => ({
  ...item,
  icon: iconByCategory[item.category] || "🍽️",
}));

const categories = [
  "Lahat",
  ...Array.from(new Set(establishments.map((item) => item.category))),
];

const preferredTowns = [
  "Boac",
  "Gasan",
  "Mogpog",
  "Buenavista",
  "Torrijos",
  "Sta. Cruz",
];
const towns = [
  "Lahat",
  ...preferredTowns.filter((name) =>
    establishments.some((item) => item.town === name),
  ),
];

const labels: Record<string, string> = {
  "Coffee Shop / Cafe": "☕ Cafe",
  "Casual Dining": "🍽️ Casual",
  "Specialty / Local Dishes": "🍲 Lokal",
  Cafeteria: "🍛 Cafeteria",
  "Cafe / Milktea Shop": "🧋 Milktea",
  Pub: "🍻 Pub",
};
export function DirectoryApp({
  mode = "home",
}: {
  mode?: "home" | "directory";
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Lahat");
  const [town, setTown] = useState("Lahat");
  const [saved, setSaved] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [visitStatus, setVisitStatus] = useState<VisitStatus>({});
  const [visitedAt, setVisitedAt] = useState<Record<string, number>>({});
  const [visitLog, setVisitLog] = useState<Record<string, VisitEntry[]>>({});
  const [visitForm, setVisitForm] = useState<Place | null>(null);
  const [communityPhotos, setCommunityPhotos] = useState<CommunityPhoto[]>([]);
  const [jeepAnimating, setJeepAnimating] = useState(false);
  useEffect(() => {
    fetch("/api/photos", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { photos: [] }))
      .then((data) => setCommunityPhotos(data.photos || []))
      .catch(() => setCommunityPhotos([]));
  }, []);
  useEffect(() => {
    if (mode !== "directory") return;
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) setQuery(initialQuery);
  }, [mode]);
  useEffect(() => {
    const local = getLocalJourney();
    setSaved(local.favorites);
    setVisitStatus(local.visitStatus);
    setVisitedAt(local.visitedAt);
    setVisitLog(local.visitLog);
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);
  useEffect(() => {
    if (!jeepAnimating) return;
    const timer = window.setTimeout(() => {
      if (mode === "home" && authReady && user) {
        window.location.assign("/directory");
      } else {
        setJeepAnimating(false);
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [authReady, jeepAnimating, mode, user]);
  useEffect(() => {
    if (!user) return;
    let unsubscribe = () => {};
    connectUserJourney(user)
      .then((journey) => {
        setSaved(journey.favorites);
        setVisitStatus(journey.visitStatus);
        setVisitedAt(journey.visitedAt);
        setVisitLog(journey.visitLog);
        unsubscribe = subscribeToUserJourney(user, (next) => {
          setSaved(next.favorites);
          setVisitStatus(next.visitStatus);
          setVisitedAt(next.visitedAt);
          setVisitLog(next.visitLog);
        });
      })
      .catch(() => {});
    return () => unsubscribe();
  }, [user]);
  const filtered = useMemo(
    () =>
      places.filter(
        (p) =>
          `${p.name} ${p.address} ${p.category} ${p.town}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (category === "Lahat" || p.category === category) &&
          (town === "Lahat" || p.town === town) &&
          (!showSaved || saved.includes(p.name)),
      ),
    [query, category, town, showSaved, saved],
  );
  const visiblePlaces = filtered;
  const dailyFeaturedPlace = useMemo(() => {
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const part = (type: "year" | "month" | "day") =>
      dateParts.find((item) => item.type === type)?.value || "0";
    const dayNumber = Number(`${part("year")}${part("month")}${part("day")}`);
    return places[dayNumber % places.length];
  }, []);
  const homepagePlaces = dailyFeaturedPlace ? [dailyFeaturedPlace] : [];
  const featuredPhoto = dailyFeaturedPlace
    ? communityPhotos.find((photo) => photo.establishment === dailyFeaturedPlace.name)
    : undefined;
  const visitedCount = user
    ? Object.values(visitLog).filter((entries) => entries.length > 0).length
    : 0;
  const toggle = (name: string) =>
    setSaved((current) => {
      const next = current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name];
      localStorage.setItem("beh-kain-kita-favorites", JSON.stringify(next));
      if (user)
        void saveUserJourney(user, { favorites: next, visitStatus, visitedAt, visitLog });
      return next;
    });
  const toggleWant = (name: string) =>
    setVisitStatus((current) => {
      const next = { ...current };
      if (next[name] === "want") delete next[name];
      else next[name] = "want";
      localStorage.setItem("beh-kain-kita-visit-status", JSON.stringify(next));
      if (user) {
        void saveUserJourney(user, {
          favorites: saved,
          visitStatus: next,
          visitedAt,
          visitLog,
        });
      }
      return next;
    });
  const logVisit = (name: string) => {
    if (!user) {
      window.location.href = `/signin?return_to=${encodeURIComponent("/directory")}`;
      return;
    }
    const place = places.find((item) => item.name === name);
    if (place) setVisitForm(place);
  };
  const saveVisit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !visitForm) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const date = String(data.get("visitDate") || "");
    const dish = String(data.get("dish") || "").trim();
    const note = String(data.get("note") || "").trim();
    const sharePhoto = data.get("sharePhoto") === "on";
    const timestamp = new Date(`${date}T12:00:00`).getTime();
    const entry: VisitEntry = { timestamp, ...(dish ? { dish } : {}), ...(note ? { note } : {}) };
    const name = visitForm.name;
    const nextLog = { ...visitLog, [name]: [...(visitLog[name] || []), entry] };
    const nextVisitedAt = { ...visitedAt, [name]: timestamp };
    const nextStatus = { ...visitStatus, [name]: "visited" as const };
    setVisitLog(nextLog);
    setVisitedAt(nextVisitedAt);
    setVisitStatus(nextStatus);
    void saveUserJourney(user, {
      favorites: saved,
      visitStatus: nextStatus,
      visitedAt: nextVisitedAt,
      visitLog: nextLog,
    });
    setVisitForm(null);
    if (sharePhoto) {
      window.location.href = `/photos?share=1&establishment=${encodeURIComponent(name)}&town=${encodeURIComponent(visitForm.town)}&dish=${encodeURIComponent(dish)}`;
    }
  };
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).getTime();
  const visitedThisMonth = user
    ? Object.values(visitLog).filter((entries) =>
        entries.some((entry) => entry.timestamp >= monthStart),
      ).length
    : 0;
  const visitedTownCount = user
    ? new Set(
        Object.entries(visitLog)
          .filter(([, entries]) => entries.length > 0)
          .map(([name]) => places.find((place) => place.name === name)?.town)
          .filter((name): name is string => Boolean(name)),
      ).size
    : 0;
  const handleJeepClick = () => {
    if (mode !== "home") return;
    if (authReady && user) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.location.assign("/directory");
        return;
      }
      setJeepAnimating(true);
      return;
    }
    setJeepAnimating(true);
  };
  const handleHomeSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) return;
    const exactMatch = places.find(
      (place) => place.name.toLocaleLowerCase() === search.toLocaleLowerCase(),
    );
    window.location.assign(
      exactMatch
        ? `/establishments/${exactMatch.slug}`
        : `/directory?q=${encodeURIComponent(search)}`,
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="menu-button photo-link"
          href="/photos"
          aria-label="Buksan ang community photos"
        >
          <span className="camera-glyph" aria-hidden="true">
            <i />
          </span>
        </a>
        <a className="brand" href="#top">
          Marinduque Food Trip
        </a>
        <a
          className="saved-button account-access"
          href="/account"
          aria-label="Buksan ang account"
        >
          <span className="account-glyph" aria-hidden="true">
            <i />
          </span>
        </a>
      </header>
      <main id="top">
        <section
          className={`hero${mode === "home" ? ` hero-jeep-stage${jeepAnimating ? " is-driving" : ""}` : ""}`}
        >
          <div
            className={`speech${mode === "home" ? " jeep-hero" : ""}`}
            role={mode === "home" ? "button" : undefined}
            tabIndex={mode === "home" ? 0 : undefined}
            aria-label={
              mode === "home"
                ? authReady && user
                  ? "Buksan ang listahan ng mga kainan"
                  : "Paandarin ang jeep"
                : undefined
            }
            onClick={handleJeepClick}
            onKeyDown={(event) => {
              if (
                mode === "home" &&
                (event.key === "Enter" || event.key === " ")
              ) {
                event.preventDefault();
                handleJeepClick();
              }
            }}
            onAnimationEnd={() => {
              if (mode === "home" && authReady && user) {
                window.location.assign("/directory");
              } else {
                setJeepAnimating(false);
              }
            }}
          >
            <span className="tape" aria-hidden="true" />
            {mode === "home" ? (
              <span className="jeep-route-sign" aria-hidden="true">
                Find. Eat. Share. Play. Repeat.
              </span>
            ) : null}
            <h1>
              Gawin nating mas masaya ang food trip mo dine sa Marinduque!
            </h1>
            {mode === "home" ? (
              <p className="jeep-hero-copy">
                Humanap ng lokal na kainan, kumpletuhin ang mga challenges,
                mag-ipon ng badges at i-share ang mga pitik mong nakakatakam.
                Ano, G?
              </p>
            ) : null}
            {mode === "home" ? (
              <span className="jeep-undercarriage" aria-hidden="true">
                <i />
                <i />
              </span>
            ) : null}
          </div>
          {mode === "home" ? (
            <form className="search-box jeep-search" onSubmit={handleHomeSearch}>
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="May hinahanap kang kainan?"
                aria-label="Maghanap ng kainan"
                autoComplete="off"
              />
              <button type="submit" aria-label="Hanapin ang kainan">→</button>
            </form>
          ) : null}
          {mode === "directory" ? (
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Hanap kita ng kainan. . ."
              />
              <button
                onClick={() => setQuery("")}
                type="button"
                aria-label="Burahin ang paghahanap"
              >
                {query ? "×" : "→"}
              </button>
            </label>
          ) : null}
        </section>
        <section className="directory" aria-labelledby="directory-title">
          {mode === "directory" && (
            <>
              <div className="section-heading">
                <div>
                  <p className="kicker">Tara, food trip sa Marinduque!</p>
                  <h2 id="directory-title">Pumili ng trip mo</h2>
                </div>
                <a
                  className="directory-home"
                  href="/"
                  aria-label="Bumalik sa homepage"
                >
                  ⌂
                </a>
              </div>
              <div className="town-filter-wrap">
                <p>📍 Saan baga ang bet mo?</p>
                <div className="town-filters" aria-label="Salain ayon sa bayan">
                  {towns.map((x) => (
                    <button
                      key={x}
                      className={town === x ? "active" : ""}
                      onClick={() => {
                        setTown(x);
                        setShowSaved(false);
                      }}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filters" aria-label="Salain ayon sa uri">
                {categories.map((x) => (
                  <button
                    key={x}
                    className={category === x ? "active" : ""}
                    onClick={() => {
                      setCategory(x);
                      setShowSaved(false);
                    }}
                  >
                    {labels[x] || x}
                  </button>
                ))}
              </div>
            </>
          )}
          {mode === "home" && authReady && (
            <section className="home-dashboard" aria-label="Food trip dashboard">
            <div className="home-section-heading">
              <div><p className="kicker">✦ Featured kainan</p><h2>Baka gusto mong itry &apos;to?</h2></div>
            </div>
            <div className="place-grid home-preview-grid">
              {homepagePlaces.map((p, i) => (
                <article className={`place-card card-${i % 4}`} key={p.name}>
                  {featuredPhoto && (
                    <a className="featured-community-photo" href="/photos" aria-label={`Community photo from ${p.name}`}>
                      <img src={featuredPhoto.imageUrl} alt={`${featuredPhoto.dishName || "Food photo"} sa ${p.name}`} />
                      <span>📷 Kuha ng community</span>
                    </a>
                  )}
                  <button
                    className={`heart ${saved.includes(p.name) ? "active" : ""}`}
                    onClick={() => toggle(p.name)}
                    aria-label={`${saved.includes(p.name) ? "Alisin sa" : "Idagdag sa"} paborito ang ${p.name}`}
                  >
                    ♥
                  </button>
                  <div className="place-icon" aria-hidden="true">
                    {p.icon}
                  </div>
                  <p className="category">{p.category}</p>
                  <h3>
                    <a
                      className="place-title-link"
                      href={`/establishments/${slugify(p.name)}`}
                    >
                      {p.name}
                    </a>
                  </h3>
                  <a
                    className="details-link"
                    href={`/establishments/${slugify(p.name)}`}
                  >
                    View details <span>→</span>
                  </a>
                  <div
                    className="visit-actions"
                    aria-label={`Visit status for ${p.name}`}
                  >
                    <button
                      className={visitLog[p.name]?.length ? "active visited" : ""}
                      onClick={() => logVisit(p.name)}
                    >
                      <span>＋</span> Log a visit
                    </button>
                    <button
                      className={
                        visitStatus[p.name] === "want" ? "active want" : ""
                      }
                      onClick={() => toggleWant(p.name)}
                      aria-pressed={visitStatus[p.name] === "want"}
                    >
                      <span>＋</span> Want to visit
                    </button>
                  </div>
                  {!!visitLog[p.name]?.length && <p className="visit-summary">Visited {visitLog[p.name].length}× · Last: {new Date(visitLog[p.name].at(-1)!.timestamp).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>}
                </article>
              ))}
            </div>
            <div id="home-challenge" className="home-challenge-grid" aria-label="Mga aktibong hamon">
              <section className="home-active-challenge" aria-labelledby="monthly-challenge-title">
                <div className="challenge-icon">🧭</div>
                <p className="kicker">Aktibong hamon</p>
                <h3 id="monthly-challenge-title">Limang kainan, isang buwan</h3>
                <span className="challenge-progress"><i style={{width: `${Math.min((visitedThisMonth / 5) * 100, 100)}%`}} /></span>
                <div className="active-challenge-meta"><span>{Math.min(visitedThisMonth, 5)}/5 kainan visited</span><span>{Math.max(5 - visitedThisMonth, 0)} na lang!</span></div>
                <a href={user ? "/directory" : "/welcome"}>{user ? "Ituloy ang hamon →" : "Gumawa ng account para sumali →"}</a>
              </section>
              <section className="home-active-challenge town-challenge" aria-labelledby="town-challenge-title">
                <div className="challenge-icon">🚐</div>
                <p className="kicker">Island food trip</p>
                <h3 id="town-challenge-title">Tatlong bayan, isang food trip</h3>
                <span className="challenge-progress"><i style={{width: `${Math.min((visitedTownCount / 3) * 100, 100)}%`}} /></span>
                <div className="active-challenge-meta"><span>{Math.min(visitedTownCount, 3)}/3 bayan visited</span><span>{Math.max(3 - visitedTownCount, 0)} na lang!</span></div>
                <a href={user ? "/directory" : "/welcome"}>{user ? "Ikot pa sa Marinduque →" : "Gumawa ng account para sumali →"}</a>
              </section>
            </div>
            <section className="home-community" aria-labelledby="community-finds-title">
              <div className="home-section-heading"><div><p className="kicker">📷 Community finds</p><h2 id="community-finds-title">Mga pitik ng kapwa foodie</h2></div><a href="/photos">Buksan ang gallery →</a></div>
              {communityPhotos.length ? <div className="home-community-grid">{communityPhotos.slice(0, 3).map((photo) => <a href="/photos" className="home-community-photo" key={photo.id}><img src={photo.imageUrl} alt={`${photo.dishName || "Food photo"} sa ${photo.establishment}`} /><span><b>{photo.dishName || photo.establishment}</b><small>♡ {photo.reactionCount} · @{photo.contributor || "Anonymous beh"}</small></span></a>)}</div> : <a className="home-community-empty" href="/photos"><span>📸</span><b>Mauna kang magbahagi ng masarap na pitik!</b><small>Buksan ang community gallery →</small></a>}
            </section>
            <section className="achievements home-badge-progress" aria-labelledby="badge-title">
              <div className="achievement-heading">
                <div>
                  <p className="kicker">Foodie milestones</p>
                  <h3 id="badge-title">Tara, paramihan ng badges!</h3>
                </div>
                <span>{visitedCount} visited</span>
              </div>
              <div className="badge-grid">
                <article
                  className={`foodie-badge ${visitedCount >= 10 ? "unlocked" : "locked"}`}
                >
                  <div className="badge-medal adventurer-medal" aria-hidden="true">
                    <span className="badge-stitches" />
                    <svg className="badge-emblem" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="20" />
                      <path d="M38 26 34 36l-8 4 4-11 8-3Z" />
                      <circle cx="32" cy="32" r="3" />
                      <path d="M32 8v6M32 50v6M8 32h6M50 32h6" />
                    </svg>
                    <b className="badge-ribbon">10 KAINAN</b>
                    {visitedCount < 10 && <span className="badge-lock">●</span>}
                  </div>
                  <div>
                    <p>
                      {visitedCount >= 10
                        ? "Unlocked!"
                        : `${Math.min(visitedCount, 10)}/10 visited`}
                    </p>
                    <h4>The Adventurer Foodie</h4>
                    <small>Visit at least 10 establishments.</small>
                    <span className="badge-progress">
                      <i
                        style={{
                          width: `${Math.min((visitedCount / 10) * 100, 100)}%`,
                        }}
                      />
                    </span>
                  </div>
                </article>
                <article
                  className={`foodie-badge ultimate ${visitedCount >= 20 ? "unlocked" : "locked"}`}
                >
                  <div className="badge-medal ultimate-medal" aria-hidden="true">
                    <span className="badge-stitches" />
                    <svg className="badge-emblem" viewBox="0 0 64 64">
                      <path d="M22 17h20v9c0 10-4 16-10 16s-10-6-10-16v-9Z" />
                      <path d="M22 21h-8c0 9 4 14 12 14M42 21h8c0 9-4 14-12 14M32 42v8M23 53h18" />
                      <path className="badge-star" d="m32 21 2.4 4.8 5.3.8-3.8 3.7.9 5.2-4.8-2.5-4.8 2.5.9-5.2-3.8-3.7 5.3-.8L32 21Z" />
                    </svg>
                    <b className="badge-ribbon">20 KAINAN</b>
                    {visitedCount < 20 && <span className="badge-lock">●</span>}
                  </div>
                  <div>
                    <p>
                      {visitedCount >= 20
                        ? "Unlocked!"
                        : `${Math.min(visitedCount, 20)}/20 visited`}
                    </p>
                    <h4>Ultimate Foodie</h4>
                    <small>Visit at least 20 establishments.</small>
                    <span className="badge-progress">
                      <i
                        style={{
                          width: `${Math.min((visitedCount / 20) * 100, 100)}%`,
                        }}
                      />
                    </span>
                  </div>
                </article>
              </div>
            </section>
            {!user && <div className="account-prompt" aria-labelledby="account-prompt-title"><div><p className="kicker">Para hindi mawala ang food trip mo</p><h3 id="account-prompt-title">Ano pang inahintay mo?</h3><p>Gumawa ng account para ma-save ang mga bet mong lugar, ma-track ang napuntahan mo, sumali sa challenges, at makapag-share ng mga pitik na nakakatakam.</p></div><a href="/welcome">Simulan na natin ang foodtrip!</a></div>}
            </section>
          )}
          {mode === "directory" &&
            (visiblePlaces.length ? (
              <div className="place-grid">
                {visiblePlaces.map((p, i) => (
                  <article className={`place-card card-${i % 4}`} key={p.name}>
                    <button
                      className={`heart ${saved.includes(p.name) ? "active" : ""}`}
                      onClick={() => toggle(p.name)}
                      aria-label={`${saved.includes(p.name) ? "Alisin sa" : "Idagdag sa"} paborito ang ${p.name}`}
                    >
                      ♥
                    </button>
                    <div className="place-icon" aria-hidden="true">
                      {p.icon}
                    </div>
                    <p className="category">{p.category}</p>
                    <h3>
                      <a
                        className="place-title-link"
                        href={`/establishments/${slugify(p.name)}`}
                      >
                        {p.name}
                      </a>
                    </h3>
                    <a
                      className="details-link"
                      href={`/establishments/${slugify(p.name)}`}
                    >
                      View details <span>→</span>
                    </a>
                    <div
                      className="visit-actions"
                      aria-label={`Visit status for ${p.name}`}
                    >
                      <button
                        className={visitLog[p.name]?.length ? "active visited" : ""}
                        onClick={() => logVisit(p.name)}
                      >
                        <span>＋</span> Log a visit
                      </button>
                      <button
                        className={
                          visitStatus[p.name] === "want" ? "active want" : ""
                        }
                        onClick={() => toggleWant(p.name)}
                        aria-pressed={visitStatus[p.name] === "want"}
                      >
                        <span>＋</span> Want to visit
                      </button>
                    </div>
                    {!!visitLog[p.name]?.length && <p className="visit-summary">Visited {visitLog[p.name].length}× · Last: {new Date(visitLog[p.name].at(-1)!.timestamp).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty">
                <span>🍽️</span>
                <h3>
                  {town !== "Lahat" && town !== "Boac"
                    ? `Papunta pa lang kami sa ${town}!`
                    : "Wala pa rito, anak."}
                </h3>
                <p>
                  {town !== "Lahat" && town !== "Boac"
                    ? "Wala pang establishments sa kasalukuyang listahan para sa bayang ito."
                    : "Subukan ang ibang salita o kategorya."}
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("Lahat");
                    setTown("Lahat");
                    setShowSaved(false);
                  }}
                >
                  Ipakita lahat
                </button>
              </div>
            ))}
        </section>
      </main>
      {visitForm && (
        <div className="visit-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setVisitForm(null); }}>
          <form className="visit-form" onSubmit={saveVisit} aria-labelledby="visit-form-title">
            <button className="visit-form-close" type="button" onClick={() => setVisitForm(null)} aria-label="Isara ang visit form">×</button>
            <p className="kicker">Food trip log</p>
            <h2 id="visit-form-title">Kumusta ang kain sa {visitForm.name}?</h2>
            <label>Date ng visit<input name="visitDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} max={new Date().toISOString().slice(0, 10)} /></label>
            <label>Anong dish ang na-try mo? <small>Optional</small><input name="dish" maxLength={100} placeholder="Hal. Lomi special" /></label>
            <label>May kuwento ka, beh? <small>Optional</small><textarea name="note" maxLength={240} rows={3} placeholder="Maikli lang—ano ang nagustuhan mo?" /></label>
            <label className="visit-photo-option"><input name="sharePhoto" type="checkbox" /> Mag-share din ng photo pagkatapos</label>
            <button className="visit-submit" type="submit">I-log ang visit →</button>
          </form>
        </div>
      )}
      <footer>
        <div className="pot" aria-hidden="true">
          ⌒<span>•‿•</span>
        </div>
        <p>Gawang may malasakit para sa lokal na kainan.</p>
        <small>Impormasyon mula sa Lakbayin target business list.</small>
      </footer>
    </div>
  );
}

export default function Home() {
  return <DirectoryApp mode="home" />;
}
