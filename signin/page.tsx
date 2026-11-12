"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { touchUserProfile } from "../user-profile";

const messageFor = (code?: string) => {
  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  )
    return "Hindi tugma ang email o password. Subukan natin ulit.";
  if (code === "auth/invalid-email")
    return "Pakitingnan kung tama ang email address.";
  if (code === "auth/too-many-requests")
    return "Masyadong maraming pagsubok. Sandali muna bago subukan ulit.";
  if (code === "auth/network-request-failed")
    return "Mahina ang koneksyon. Subukan natin ulit.";
  return "Hindi makapag-sign in. Pakisubukan ulit.";
};

export default function SigninPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        String(form.get("email") || "").trim(),
        String(form.get("password") || ""),
      );
      await touchUserProfile(credential.user);
      const requested = new URLSearchParams(window.location.search).get(
        "return_to",
      );
      window.location.assign(
        requested?.startsWith("/") && !requested.startsWith("//")
          ? requested
          : "/account",
      );
    } catch (error) {
      setMessage(messageFor((error as { code?: string }).code));
      setSubmitting(false);
    }
  }
  return (
    <main className="signup-page">
      <a className="signup-brand" href="/">
        Marinduque Food Trip
      </a>
      <section className="signup-card" aria-labelledby="signin-title">
        <p className="signup-kicker">✦ Welcome back, beh!</p>
        <h1 id="signin-title">Tuloy ang food trip!</h1>
        <p className="signup-subtitle">
          Wala ka pang account? <a href="/signup">Sign up</a>
        </p>
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="beh@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ilagay ang password"
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Papasok na…" : "Sign in →"}
          </button>
          {message && (
            <p className="signup-message signup-error" role="alert">
              {message}
            </p>
          )}
        </form>
        <a className="signup-home" href="/">← Bumalik sa homepage</a>
        <p className="signup-privacy">
          Ang iyong account ay protektado ng Firebase Authentication.
        </p>
      </section>
    </main>
  );
}
