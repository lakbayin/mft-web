"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { establishments } from "../establishments/data";
import { auth, db } from "../firebase";
import type { UserJourney } from "../user-journey";

const ADMIN_EMAIL = "pevidalj@gmail.com";

type RankedItem = { name: string; count: number; town: string };
type AdminPhoto = {
  id: string;
  establishment: string;
  town: string;
  dishName: string;
  caption: string;
  contributor: string;
  createdAt: number;
  reportCount: number;
  reportReasons: string | null;
  imageUrl: string;
};

function rank(names: string[]): RankedItem[] {
  const counts = new Map<string, number>();
  names.forEach((name) => counts.set(name, (counts.get(name) || 0) + 1));
  return Array.from(counts, ([name, count]) => ({
    name,
    count,
    town: establishments.find((item) => item.name === name)?.town || "Marinduque",
  }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 8);
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    setReady(true);
    if (!current) window.location.replace("/signin?return_to=/admin");
  }), []);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    user!.getIdToken().then((token) => Promise.all([
      getDocs(collection(db, "userProfiles")),
      getDocs(collection(db, "userJourneys")),
      fetch("/api/admin/photos", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load photos");
        return data.photos as AdminPhoto[];
      }),
    ]))
      .then(([profiles, journeyDocs, communityPhotos]) => {
        setUserCount(profiles.size);
        setJourneys(
          journeyDocs.docs.map((item) => item.data() as UserJourney),
        );
        setPhotos(communityPhotos);
      })
      .catch(() => setError("Hindi mabasa ang insights. Pakipublish muna ang Firestore security rules."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  async function removePhoto(photo: AdminPhoto) {
    if (!window.confirm(`Remove ${photo.dishName} from the community gallery?`)) return;
    setRemoving(photo.id);
    setError("");
    try {
      const token = await user!.getIdToken();
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Could not remove photo");
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
    } catch {
      setError("Hindi maalis ang photo. Pakisubukan ulit.");
    } finally {
      setRemoving(null);
    }
  }

  const stats = useMemo(() => {
    const favorites = journeys.flatMap((item) => item.favorites || []);
    const visited = journeys.flatMap((item) =>
      Object.entries(item.visitStatus || {})
        .filter(([, status]) => status === "visited")
        .map(([name]) => name),
    );
    const wanted = journeys.flatMap((item) =>
      Object.entries(item.visitStatus || {})
        .filter(([, status]) => status === "want")
        .map(([name]) => name),
    );
    const townCounts = new Map<string, number>();
    [...favorites, ...visited, ...wanted].forEach((name) => {
      const town = establishments.find((item) => item.name === name)?.town;
      if (town) townCounts.set(town, (townCounts.get(town) || 0) + 1);
    });
    return {
      favorites,
      visited,
      wanted,
      topFavorites: rank(favorites),
      topVisited: rank(visited),
      towns: Array.from(townCounts, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };
  }, [journeys]);

  if (!ready || !user) return <main className="admin-page"><p className="admin-state">Binubuksan ang admin dashboard…</p></main>;
  if (!isAdmin) return <main className="admin-page"><section className="admin-denied"><p>✦ Private para kay admin</p><h1>Hindi para sa account na ito, beh.</h1><span>Mag-sign in gamit ang authorized admin email.</span><a href="/account">← Bumalik sa account</a></section></main>;

  return (
    <main className="admin-page">
      <header className="admin-header"><a href="/account">← Account</a><b>Marinduque Food Trip</b><span>Admin</span></header>
      <section className="admin-hero"><p>✦ Admin insights</p><h1>Kumusta ang food trip natin?</h1><span>Isang mabilis na tanaw sa community at mga kinahihiligang kainan.</span></section>
      {loading ? <p className="admin-state">Kinukuha ang pinakabagong bilang…</p> : error ? <p className="admin-error" role="alert">{error}</p> : <>
        <section className="admin-stat-grid" aria-label="Summary statistics">
          <article><span>Mga account</span><strong>{userCount}</strong><small>registered users</small></article>
          <article><span>Mga paborito</span><strong>{stats.favorites.length}</strong><small>favorite marks</small></article>
          <article><span>Napuntahan</span><strong>{stats.visited.length}</strong><small>visited marks</small></article>
          <article><span>Gustong puntahan</span><strong>{stats.wanted.length}</strong><small>want-to-visit marks</small></article>
          <article><span>Community photos</span><strong>{photos.length}</strong><small>{photos.filter((photo) => Number(photo.reportCount) > 0).length} reported</small></article>
        </section>
        <section className="admin-panels">
          <article className="admin-panel"><p>♥ Community favorites</p><h2>Pinakapaboritong kainan</h2><RankedList items={stats.topFavorites} empty="Wala pang favorite marks." /></article>
          <article className="admin-panel green"><p>✓ Food-trip activity</p><h2>Pinakabinibisitang kainan</h2><RankedList items={stats.topVisited} empty="Wala pang visited marks." /></article>
          <article className="admin-panel wide"><p>📍 Town pulse</p><h2>Saan pinakamadalas ang engagement?</h2>{stats.towns.length ? <div className="town-bars">{stats.towns.map((town) => <div key={town.name}><span>{town.name}</span><i><b style={{width:`${Math.max(8, town.count / stats.towns[0].count * 100)}%`}} /></i><strong>{town.count}</strong></div>)}</div> : <p className="admin-empty">Wala pang activity ayon sa bayan.</p>}</article>
          <article className="admin-panel wide admin-photo-manager"><div className="admin-photo-heading"><div><p>▣ Community moderation</p><h2>Mga pitik ng community</h2></div><span>{photos.filter((photo) => Number(photo.reportCount) > 0).length} may report</span></div>{photos.length ? <div className="admin-photo-grid">{photos.map((photo) => <article className={Number(photo.reportCount) > 0 ? "reported" : ""} key={photo.id}><img src={photo.imageUrl} alt={`${photo.dishName} sa ${photo.establishment}`} loading="lazy"/><div><p>{photo.establishment} · {photo.town}</p><h3>{photo.dishName}</h3><small>By {photo.contributor}</small>{Number(photo.reportCount) > 0 && <aside><b>{photo.reportCount} report{Number(photo.reportCount) === 1 ? "" : "s"}</b><span>{photo.reportReasons}</span></aside>}<button type="button" disabled={removing === photo.id} onClick={() => removePhoto(photo)}>{removing === photo.id ? "Inaalis…" : "Remove photo"}</button></div></article>)}</div> : <p className="admin-empty">Wala pang community photos.</p>}</article>
        </section>
      </>}
    </main>
  );
}

function RankedList({ items, empty }: { items: RankedItem[]; empty: string }) {
  if (!items.length) return <p className="admin-empty">{empty}</p>;
  return <ol className="ranked-list">{items.map((item, index) => <li key={item.name}><b>{index + 1}</b><span><strong>{item.name}</strong><small>{item.town}</small></span><em>{item.count}</em></li>)}</ol>;
}
