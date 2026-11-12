"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import { establishments, slugify } from "../establishments/data";
const towns = [
  "Boac",
  "Gasan",
  "Mogpog",
  "Buenavista",
  "Torrijos",
  "Sta. Cruz",
];
type SharedPhoto = {
  id: string;
  establishment: string;
  town: string;
  dishName: string;
  caption: string;
  contributor: string;
  createdAt: number;
  imageUrl: string;
  reactionCount: number;
  reacted: boolean;
};
export default function PhotosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [photos, setPhotos] = useState<SharedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTown, setSelectedTown] = useState("Boac");
  const [prefillEstablishment, setPrefillEstablishment] = useState("");
  const [prefillDish, setPrefillDish] = useState("");
  const [reported, setReported] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const load = async (currentUser: User | null = user) => {
    try {
      const response = await fetch("/api/photos", {
        cache: "no-store",
        headers: currentUser
          ? { Authorization: `Bearer ${await currentUser.getIdToken()}` }
          : {},
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load photos.");
      setPhotos(data.photos);
    } catch {
      setMessage("Hindi ma-load ang gallery ngayon.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("share") === "1") {
      setShowForm(true);
      setPrefillEstablishment(params.get("establishment") || "");
      setPrefillDish(params.get("dish") || "");
      if (params.get("town")) setSelectedTown(params.get("town")!);
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      void load(currentUser);
    });
  }, []);
  const choose = (file?: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : "");
  };
  const openForm = () => {
    setShowForm(true);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: { Authorization: `Bearer ${await user!.getIdToken()}` },
        body: new FormData(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Hindi na-upload ang photo.");
      const sharedIds = JSON.parse(
        localStorage.getItem("beh-kain-kita-shared-photo-ids") || "[]",
      );
      localStorage.setItem(
        "beh-kain-kita-shared-photo-ids",
        JSON.stringify([
          data.id,
          ...sharedIds.filter((id: string) => id !== data.id),
        ]),
      );
      form.reset();
      choose();
      setMessage("Naka-post na ang photo mo, beh! ✦");
      await load(user);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Hindi na-upload ang photo.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const report = async (photo: SharedPhoto) => {
    const reason = window.prompt(
      `Why are you reporting this photo from ${photo.establishment}?`,
    );
    if (!reason?.trim()) return;
    try {
      const response = await fetch(`/api/photos/${photo.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send report.");
      setReported((current) => [...current, photo.id]);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Could not send report.",
      );
    }
  };
  const react = async (photo: SharedPhoto) => {
    if (!user) {
      window.location.href = "/signin?return_to=/photos";
      return;
    }
    try {
      const response = await fetch(`/api/photos/${photo.id}/react`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Hindi ma-save ang reaction.");
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
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Hindi ma-save ang reaction.",
      );
    }
  };
  return (
    <div className="app-shell photos-shell">
      <header className="topbar">
        <a
          className="menu-button back-link"
          href="/"
          aria-label="Bumalik sa directory"
        >
          ←
        </a>
        <a className="brand" href="/">
          Marinduque Food Trip
        </a>
        <span className="camera-glyph photo-nav-camera" aria-hidden="true">
          <i />
        </span>
      </header>
      <main className="photos-page">
        <section className="photo-intro">
          <p className="eyebrow">
            <span>✦</span> Kain. Pitik. Share.
          </p>
          <h1>Mga kuhang masarap</h1>
          <p>
            Tingnan ang food trips ng community, tapos i-share rin ang paborito
            mong order sa Marinduque.
          </p>
          <button className="share-open" onClick={openForm}>
            {authReady && user
              ? "＋ Share your food photo"
              : "Sign in to share a photo"}
          </button>
        </section>
        <section className="community-gallery" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <div>
              <p className="kicker">Community gallery</p>
              <h2 id="gallery-title">Food trips ng mga beh</h2>
            </div>
          </div>
          {loading ? (
            <div className="gallery-empty">Kinukuha ang mga larawan…</div>
          ) : photos.length ? (
            <div className="photo-grid">
              {photos.map((photo) => {
                const establishmentSlug = slugify(photo.establishment);
                const hasEstablishmentPage = establishments.some(
                  (item) => item.slug === establishmentSlug,
                );
                return <article className="photo-post" key={photo.id}>
                  <img
                    src={photo.imageUrl}
                    alt={`${photo.establishment}${photo.dishName ? `: ${photo.dishName}` : ""}`}
                    loading="lazy"
                  />
                  <div>
                    <p>
                      {hasEstablishmentPage ? (
                        <a
                          className="photo-establishment-link"
                          href={`/establishments/${establishmentSlug}`}
                          aria-label={`Tingnan ang ${photo.establishment}`}
                        >
                          📍 {photo.establishment} · {photo.town} <span>→</span>
                        </a>
                      ) : (
                        <>📍 {photo.establishment} · {photo.town}</>
                      )}
                    </p>
                    {photo.dishName && <h3>{photo.dishName}</h3>}
                    {photo.caption && <blockquote>{photo.caption}</blockquote>}
                    <small>
                      Shared by {photo.contributor || "Anonymous beh"} ·{" "}
                      {new Date(photo.createdAt).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </small>
                    <div className="photo-actions">
                      <button
                        className={`photo-reaction${photo.reacted ? " reacted" : ""}`}
                        onClick={() => react(photo)}
                        aria-pressed={photo.reacted}
                        disabled={!authReady || !user}
                        title={!user ? "Mag-sign in para makapag-react" : undefined}
                      >
                        {photo.reacted ? "♥" : "♡"} Nakatakam ngani!{" "}
                        <span>{photo.reactionCount}</span>
                      </button>
                      <button
                        className="report-photo"
                        disabled={reported.includes(photo.id)}
                        onClick={() => report(photo)}
                      >
                        {reported.includes(photo.id)
                          ? "Report sent ✓"
                          : "Report photo"}
                      </button>
                    </div>
                  </div>
                </article>;
              })}
            </div>
          ) : (
            <div className="gallery-empty">
              <span>📸</span>
              <h3>Ikaw ang mauna, beh!</h3>
              <p>Wala pang photos. Ipakita ang paborito mong kainan.</p>
              <button onClick={openForm}>Share a photo</button>
            </div>
          )}
        </section>
        {showForm && !user && (
          <section className="photo-signin-gate">
            <span aria-hidden="true">▣</span>
            <p className="kicker">Para sa registered users</p>
            <h2>Sign in muna, beh!</h2>
            <p>
              Gumawa o buksan ang account mo para makapag-share ng food photo sa
              community.
            </p>
            <div>
              <a href="/signin?return_to=/photos">Sign in →</a>
              <a href="/signup">Gumawa ng account</a>
            </div>
          </section>
        )}
        {showForm && user && (
          <section className="share-panel">
            <form ref={formRef} className="photo-form" onSubmit={submit}>
              <span className="tape" aria-hidden="true" />
              <div className="form-title">
                <div>
                  <p className="kicker">Community post</p>
                  <h2>Share your food trip</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Isara ang form"
                >
                  ×
                </button>
              </div>
              <div className="form-grid">
                <label>
                  Your nickname
                  <input
                    name="contributor"
                    maxLength={60}
                    required
                    defaultValue={user.displayName || ""}
                    placeholder="Hal. Juana"
                  />
                </label>
                <label>
                  Town
                  <select
                    name="town"
                    required
                    value={selectedTown}
                    onChange={(event) => setSelectedTown(event.target.value)}
                  >
                    {towns.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Establishment
                  <input
                    name="establishment"
                    list="establishment-options"
                    required
                    autoComplete="off"
                    defaultValue={prefillEstablishment}
                    placeholder="I-type ang pangalan ng kainan"
                    onChange={(event) => {
                      const match = establishments.find(
                        (item) => item.name === event.target.value,
                      );
                      if (match) setSelectedTown(match.town);
                    }}
                  />
                  <datalist id="establishment-options">
                    {establishments.map((item) => (
                      <option value={item.name} key={item.slug}>
                        {item.town} · {item.category}
                      </option>
                    ))}
                  </datalist>
                </label>
                <label>
                  Dish or order
                  <input
                    name="dishName"
                    maxLength={100}
                    required
                    defaultValue={prefillDish}
                    placeholder="Hal. Lomi special"
                  />
                </label>
              </div>
              <label className="file-field">
                <span>{preview ? "Palitan ang photo" : "Pumili ng photo"}</span>
                <small>JPG, PNG, or WebP · hanggang 5 MB</small>
                <input
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(event) => choose(event.target.files?.[0])}
                />
              </label>
              {preview && (
                <img
                  className="upload-preview"
                  src={preview}
                  alt="Preview ng napiling photo"
                />
              )}
              <label>
                Caption
                <textarea
                  name="caption"
                  maxLength={240}
                  rows={3}
                  placeholder="Anong masarap dito?"
                />
              </label>
              <label className="consent">
                <input name="consent" type="checkbox" required />
                <span>
                  Ako ang kumuha ng photo at pumapayag akong maipakita ito sa
                  community gallery.
                </span>
              </label>
              <button className="share-button" disabled={submitting}>
                {submitting ? "Pinopost…" : "Post photo →"}
              </button>
              {message && (
                <p className="form-message" role="status">
                  {message}
                </p>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
