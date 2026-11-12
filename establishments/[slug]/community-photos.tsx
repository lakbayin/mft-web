"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../../firebase";
type Photo = {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  dishName: string;
  caption: string;
  contributor: string;
  reactionCount: number;
  reacted: boolean;
};
export default function CommunityPhotos({
  establishment,
}: {
  establishment: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        const controller = new AbortController();
        void (async () => {
          const response = await fetch(
            `/api/photos?establishment=${encodeURIComponent(establishment)}`,
            {
              signal: controller.signal,
              headers: currentUser
                ? { Authorization: `Bearer ${await currentUser.getIdToken()}` }
                : {},
            },
          );
          if (!response.ok) throw new Error();
          const data = await response.json();
          setPhotos(data.photos ?? []);
        })()
          .catch(() => setPhotos([]))
          .finally(() => setLoading(false));
        return () => controller.abort();
      }),
    [establishment],
  );
  const report = async (photo: Photo) => {
    const reason = window.prompt(
      `Why are you reporting this photo from ${establishment}?`,
    );
    if (!reason?.trim()) return;
    const response = await fetch(`/api/photos/${photo.id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (response.ok) setReported((current) => [...current, photo.id]);
    else window.alert("Could not send report.");
  };
  const react = async (photo: Photo) => {
    if (!user) {
      window.location.href = "/signin?return_to=/photos";
      return;
    }
    const response = await fetch(`/api/photos/${photo.id}/react`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
    const data = await response.json();
    if (response.ok)
      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id
            ? {
                ...item,
                reacted: data.reacted,
                reactionCount: data.reactionCount,
              }
            : item,
        ),
      );
    else window.alert(data.error || "Hindi ma-save ang reaction.");
  };
  return (
    <section className="profile-community" aria-labelledby="community-heading">
      <div className="community-heading">
        <div>
          <p>Community gallery</p>
          <h2 id="community-heading">Mga kuha ng kapwa foodies</h2>
        </div>
        <a href="/photos">Share your photo →</a>
      </div>
      {loading ? (
        <div className="community-empty">Loading community photos…</div>
      ) : photos.length ? (
        <div className="profile-photo-grid">
          {photos.map((photo) => (
            <article className="profile-photo" key={photo.id}>
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={
                  photo.dishName
                    ? `${photo.dishName} at ${establishment}`
                    : `Community photo from ${establishment}`
                }
                loading="lazy"
              />
              <div>
                <strong>{photo.dishName || establishment}</strong>
                <span>Shared by {photo.contributor}</span>
                {photo.caption && <p>{photo.caption}</p>}
                <div className="profile-photo-actions">
                  <button
                    className={`profile-reaction${photo.reacted ? " reacted" : ""}`}
                    onClick={() => react(photo)}
                    aria-pressed={photo.reacted}
                    disabled={!user}
                    title={!user ? "Mag-sign in para makapag-react" : undefined}
                  >
                    {photo.reacted ? "♥" : "♡"} Nakatakam ngani!{" "}
                    <span>{photo.reactionCount}</span>
                  </button>
                  <button
                    className="profile-report"
                    disabled={reported.includes(photo.id)}
                    onClick={() => report(photo)}
                  >
                    {reported.includes(photo.id)
                      ? "Report sent ✓"
                      : "Report photo"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="community-empty">
          <span>📷</span>
          <div>
            <strong>Wala pang photos dito.</strong>
            <p>Ikaw na ang unang mag-share ng food trip mo, beh!</p>
          </div>
          <a href="/photos">Share a photo</a>
        </div>
      )}
    </section>
  );
}
