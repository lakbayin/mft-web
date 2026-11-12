"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { establishments } from "../establishments/data";
import { auth } from "../firebase";
import {
  connectUserJourney,
  subscribeToUserJourney,
  type VisitStatus,
} from "../user-journey";

type SharedPhoto = {
  id: string;
  establishment: string;
  town: string;
  dishName: string;
  caption: string;
  createdAt: number;
  imageUrl: string;
};

const townOrder = ["Boac", "Gasan", "Mogpog", "Buenavista", "Torrijos", "Sta. Cruz"];

function List({
  title,
  icon,
  names,
  empty,
}: {
  title: string;
  icon: string;
  names: string[];
  empty: string;
}) {
  const townCounts = names.reduce<Record<string, number>>((counts, name) => {
    const town = establishments.find((item) => item.name === name)?.town || "Iba pa";
    counts[town] = (counts[town] || 0) + 1;
    return counts;
  }, {});
  const towns = Object.entries(townCounts).sort(
    ([a], [b]) =>
      (townOrder.indexOf(a) < 0 ? 99 : townOrder.indexOf(a)) -
      (townOrder.indexOf(b) < 0 ? 99 : townOrder.indexOf(b)),
  );
  return (
    <section className="account-list">
      <div className="account-list-heading">
        <span>{icon}</span>
        <div>
          <h2>{title}</h2>
        </div>
      </div>
      {names.length ? (
        <div className="account-summary">
          <div className="account-total">
            <strong>{names.length}</strong>
            <span>{names.length === 1 ? "establishment" : "establishments"}</span>
          </div>
          <div className="account-town-counts" aria-label={`${title} ayon sa bayan`}>
            {towns.map(([town, count]) => (
              <div key={town}>
                <span>{town}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="account-empty">{empty}</p>
      )}
    </section>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<VisitStatus>({});
  const [loaded, setLoaded] = useState(false);
  const [sharedPhotos, setSharedPhotos] = useState<SharedPhoto[]>([]);
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (!currentUser) window.location.replace("/signin?return_to=/account");
    });
  }, []);
  useEffect(() => {
    if (!user) return;
    let unsubscribe = () => {};
    connectUserJourney(user)
      .then((journey) => {
        setFavorites(journey.favorites);
        setStatuses(journey.visitStatus);
        setLoaded(true);
        unsubscribe = subscribeToUserJourney(user, (next) => {
          setFavorites(next.favorites);
          setStatuses(next.visitStatus);
        });
      })
      .catch(() => setLoaded(true));
    const sharedIds: string[] = JSON.parse(
      localStorage.getItem("beh-kain-kita-shared-photo-ids") || "[]",
    );
    fetch("/api/photos", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) =>
        setSharedPhotos(
          (data.photos || []).filter((photo: SharedPhoto) =>
            sharedIds.includes(photo.id),
          ),
        ),
      )
      .catch(() => setSharedPhotos([]));
    return () => unsubscribe();
  }, [user]);
  const visited = Object.entries(statuses)
    .filter(([, value]) => value === "visited")
    .map(([name]) => name);
  const wanted = Object.entries(statuses)
    .filter(([, value]) => value === "want")
    .map(([name]) => name);
  if (!authReady || !user) return <main className="account-page"><p className="account-loading">Binubuksan ang account mo…</p></main>;
  return (
    <main className="account-page">
      <header className="account-header">
        <a className="account-home" href="/" aria-label="Pumunta sa homepage">
          ⌂
        </a>
        <b>Marinduque Food Trip</b>
        <div className="account-header-actions">
          {user.email?.toLowerCase() === "pevidalj@gmail.com" && (
            <a className="account-header-button" href="/admin">Admin insights</a>
          )}
          <button className="account-header-button" type="button" onClick={() => signOut(auth).then(() => window.location.assign("/"))}>Sign out</button>
        </div>
      </header>
      <section className="account-hero">
        <p>✦ Ang food journey mo</p>
        <h1>Kumusta, {user.displayName || "beh"}?</h1>
        <span>
          Dito mo makikita ang mga bet, napuntahan, at gusto mo pang puntahang
          kainan.
        </span>
      </section>
      {loaded ? (
        <div className="account-grid">
          <List
            title="Mga paborito"
            icon="♥"
            names={favorites}
            empty="Wala ka pang paborito. Pusuan mo lang ang bet mong kainan!"
          />
          <List
            title="Napuntahan ko"
            icon="✓"
            names={visited}
            empty="Wala pang naka-check dito. Tara, food trip muna!"
          />
          <List
            title="Gusto kong puntahan"
            icon="＋"
            names={wanted}
            empty="May bet ka? Idagdag mo sa Want to visit."
          />
        </div>
      ) : (
        <p className="account-loading">Kinukuha ang food journey mo…</p>
      )}
      <section className="account-gallery" aria-labelledby="my-photos-title">
        <div className="account-gallery-heading">
          <div>
            <p>✦ Mga pitik mo</p>
            <h2 id="my-photos-title">My shared photos</h2>
          </div>
          <a href="/photos">＋ Mag-share ng photo</a>
        </div>
        {sharedPhotos.length ? (
          <div className="account-photo-grid">
            {sharedPhotos.map((photo) => (
              <article key={photo.id}>
                <img
                  src={photo.imageUrl}
                  alt={`${photo.dishName} sa ${photo.establishment}`}
                  loading="lazy"
                />
                <div>
                  <p>📍 {photo.establishment} · {photo.town}</p>
                  <h3>{photo.dishName}</h3>
                  {photo.caption && <span>{photo.caption}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-gallery-empty">
            <span>▣</span>
            <h3>Wala ka pang na-share na pitik.</h3>
            <p>Ipakita sa ibang beh kung ano ang masarap!</p>
            <a href="/photos">I-share ang unang photo →</a>
          </div>
        )}
      </section>
    </main>
  );
}
